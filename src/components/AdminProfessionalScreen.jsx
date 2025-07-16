// src/components/AdminProfessionalScreen.jsx
import React, { useState, useEffect } from 'react';

export default function AdminProfessionalScreen({
  services = [],
  stylists = [],
  onAddProfessional,
  onUpdateProfessional,
  onDeleteProfessional
}) {
  const daysOfWeek = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [selected, setSelected] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [exceptions, setExceptions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (editingId) {
      const prof = stylists.find(s => s.id === editingId);
      if (prof) {
        setName(prof.name);
        setAlias(prof.alias || '');
        setSelected(prof.specialties || []);
        setSchedule(
          Object.fromEntries(
            Object.entries(prof.schedule || {}).map(([d, val]) => [
              d,
              Array.isArray(val) ? val : [val]
            ])
          )
        );
        setExceptions(prof.exceptions || []);
      }
    }
  }, [editingId, stylists]);

  const toggleSpecialty = svcName => {
    setSelected(sel =>
      sel.includes(svcName) ? sel.filter(x => x !== svcName) : [...sel, svcName]
    );
  };

  const toggleDay = day => {
    setSchedule(sc => {
      const copy = { ...sc };
      if (copy[day]) delete copy[day];
      else copy[day] = [{ from: '', to: '' }];
      return copy;
    });
  };

  const addBlock = day => {
    setSchedule(sc => ({
      ...sc,
      [day]: [...(sc[day] || []), { from: '', to: '' }]
    }));
  };

  const removeBlock = (day, idx) => {
    setSchedule(sc => ({
      ...sc,
      [day]: sc[day].filter((_, i) => i !== idx)
    }));
  };

  const copyDay = day => {
    const targetInput = window.prompt(
      `Copiar horario de ${day} a qué días? (Ej: Martes,Miercoles)`
    );
    if (!targetInput) return;
    const targets = targetInput
      .split(',')
      .map(t => t.trim())
      .filter(t => daysOfWeek.includes(t) && t !== day);
    if (targets.length === 0) return;
    setSchedule(sc => {
      const blocks = (sc[day] || []).map(b => ({ ...b }));
      const copy = { ...sc };
      targets.forEach(t => {
        copy[t] = blocks.map(b => ({ ...b }));
      });
      return copy;
    });
  };

  const setTime = (day, idx, field, value) => {
    setSchedule(sc => ({
      ...sc,
      [day]: sc[day].map((b, i) =>
        i === idx ? { ...b, [field]: value } : b
      )
    }));
  };

  const addException = date => {
    if (date && !exceptions.includes(date)) {
      setExceptions(ex => [...ex, date]);
    }
  };

  const removeException = date => {
    setExceptions(ex => ex.filter(d => d !== date));
  };

  const resetForm = () => {
    setName('');
    setAlias('');
    setSelected([]);
    setSchedule({});
    setExceptions([]);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const data = {
      name,
      alias: alias.trim(),
      specialties: selected,
      schedule,
      exceptions
    };
    if (editingId) {
      onUpdateProfessional(editingId, data);
    } else {
      onAddProfessional(data);
    }
    resetForm();
  };

  const handleDelete = id => {
    if (window.confirm('¿Estás seguro de eliminar este profesional?')) {
      onDeleteProfessional(id);
      if (editingId === id) resetForm();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">
        {editingId ? 'Editar Profesional' : 'Agregar Profesional'}
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Alias de pago"
          value={alias}
          onChange={e => setAlias(e.target.value)}
          className="border p-2 w-full rounded"
        />

        <div>
          <h3 className="font-medium mb-2">Especialidades</h3>
          <div className="grid grid-cols-2 gap-2">
            {services.map(svc => (
              <label key={svc.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selected.includes(svc.name)}
                  onChange={() => toggleSpecialty(svc.name)}
                  className="mr-2"
                />
                {svc.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Horarios de trabajo</h3>
          <div className="space-y-2">
            {daysOfWeek.map(day => (
              <div key={day} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={Boolean(schedule[day])}
                    onChange={() => toggleDay(day)}
                  />
                  <span className="w-20">{day}</span>
                  {schedule[day] && (
                    <>
                      <button
                        type="button"
                        onClick={() => addBlock(day)}
                        className="text-green-600"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => copyDay(day)}
                        className="text-blue-600 ml-1"
                        title="Copiar a otros"
                      >
                        ⎘
                      </button>
                    </>
                  )}
                </div>
                {schedule[day] &&
                  schedule[day].map((block, i) => (
                    <div key={i} className="flex items-center space-x-2 ml-8">
                      <input
                        type="time"
                        value={block.from}
                        onChange={e => setTime(day, i, 'from', e.target.value)}
                        className="border p-1 rounded"
                      />
                      <span>a</span>
                      <input
                        type="time"
                        value={block.to}
                        onChange={e => setTime(day, i, 'to', e.target.value)}
                        className="border p-1 rounded"
                      />
                      {schedule[day].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBlock(day, i)}
                          className="text-red-500"
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Excepciones (Feriados)</h3>
          <div className="flex space-x-2 mb-2">
            <input id="exc-date" type="date" className="border p-1 rounded" />
            <button
              onClick={() => addException(document.getElementById('exc-date').value)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Agregar
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {exceptions.map(date => (
              <li key={date} className="flex justify-between items-center">
                <span>{date}</span>
                <button
                  onClick={() => removeException(date)}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
        >
          {editingId ? 'Guardar Cambios' : 'Agregar Profesional'}
        </button>
      </div>

      {stylists.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Lista de Profesionales</h3>
          <ul className="space-y-2">
            {stylists.map(st => (
              <li
                key={st.id}
                className="bg-white rounded-2xl shadow p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{st.name}</p>
                  <p className="text-sm text-gray-500">
                    {st.specialties?.join(', ') || 'Sin especialidades'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Alias de pago: {st.alias || '—'}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingId(st.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(st.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
