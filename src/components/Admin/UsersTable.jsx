import React from 'react';

const UsersTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Cédula</th>
          <th>Correo</th>
          <th>Dirección</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* User rows will be mapped here */}
      </tbody>
    </table>
  );
};

export default UsersTable;
