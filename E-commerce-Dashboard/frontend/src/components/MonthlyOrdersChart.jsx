import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "../styles/Charts.css";

const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthlyOrdersChart({ data }) {
  const chartData = data.map(d => ({
    month: months[d._id],
    orders: d.totalOrders
  }));

  return (
    <div className="chart-card">
      <h3>Monthly Order Count</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
