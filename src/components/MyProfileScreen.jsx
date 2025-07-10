import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../AuthProvider';

export default function MyProfileScreen() {
  const { user, profile } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Completa nombre y apellido');
      return;
    }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      alert('Datos actualizados');
    } catch (err) {
      alert('Error al guardar');
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Mi Perfil</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Apellido"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
