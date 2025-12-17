import React from 'react';

export default function Loader({ message = 'Cargando...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <svg width="48" height="48" viewBox="0 0 50 50" aria-hidden="true">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4">
          <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div style={{ marginTop: 12, color: '#333' }}>{message}</div>
    </div>
  );
}
