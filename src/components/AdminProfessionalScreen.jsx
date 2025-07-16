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
  const [copyFrom, setCopyFrom] = useState('');
  const [copyTo, setCopyTo] = useState([]);

  useEffect(() => {
    if (editingId) {
      const prof = stylists.find(s => s.id === editingId);
      if (prof) {
        setName(prof.name);
        setAlias(prof.alias || '');
        setSelected(prof.specialties || []);
        setSchedule(prof.schedule || {});
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
      else copy[day] = { from: '', to: '' };
      return copy;
    });
  };

  const setTime = (day, field, value) => {
    setSchedule(sc => ({
      ...sc,
      [day]: { ...sc[day], [field]: value }
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

  const handleCopySchedule = () => {
    if (!copyFrom || copyTo.length === 0 || !schedule[copyFrom]) return;
    setSchedule(sc => {
      const newSc = { ...sc };
      copyTo.forEach(d => {
        if (d !== copyFrom) newSc[d] = { ...sc[copyFrom] };
      });
      return newSc;
    });
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
              <div key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Boolean(schedule[day])}
                  onChange={() => toggleDay(day)}
                />
                <span className="w-20">{day}</span>
                {schedule[day] && (
                  <>
                    <input
                      type="time"
                      value={schedule[day].from}
                      onChange={e => setTime(day, 'from', e.target.value)}
                      className="border p-1 rounded"
                    />
                    <span>a</span>
                    <input
                      type="time"
                      value={schedule[day].to}
                      onChange={e => setTime(day, 'to', e.target.value)}
                      className="border p-1 rounded"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Copiar horario</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <select
              value={copyFrom}
              onChange={e => setCopyFrom(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Desde...</option>
              {daysOfWeek.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              multiple
              value={copyTo}
              onChange={e =>
                setCopyTo(Array.from(e.target.selectedOptions, o => o.value))
              }
              className="border p-2 rounded flex-1"
            >
              {daysOfWeek.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleCopySchedule}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition"
            >
              Copiar
            </button>
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
