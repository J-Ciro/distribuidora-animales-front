import React from 'react';

const UserOrders = () => {
  return (
    <div>
      <h2>Pedidos del Usuario</h2>
      <table>
        <thead>
          <tr>
            <th>ID de pedido</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {/* Order rows will be mapped here */}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrders;
