import "../styles/Tables.css";

export default function TopCustomersTable({ customers }) {
  return (
    <div className="table-card">
      <h3>Top 5 Customers</h3>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total Orders</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i}>
              <td>{c._id}</td>
              <td>{c.totalOrders}</td>
              <td>₹ {c.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
