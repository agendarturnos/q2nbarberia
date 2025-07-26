import React from 'react';
export default function Nav({ role, onRole }) {
  return (
    <nav className="p-4 flex space-x-2 bg-gray-100">
      {['client','admin','professional'].map(r=>(
        <button key={r} onClick={()=>onRole(r)} className={`px-4 py-2 rounded ${role===r?'bg-[#c2956b]':''}`}>
          {r.charAt(0).toUpperCase()+r.slice(1)}
        </button>
      ))}
    </nav>
  );
}
