import React from 'react';

export default function SimpleModal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full z-10 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
