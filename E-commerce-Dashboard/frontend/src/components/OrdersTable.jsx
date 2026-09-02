import "../styles/Tables.css";

export default function OrdersTable({ orders }) {
  return (
    <div className="table-card">
      <h3>Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>{o.product}</td>
              <td>₹ {o.amount}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
