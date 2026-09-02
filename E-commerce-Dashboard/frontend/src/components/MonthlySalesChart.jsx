import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot
} from "recharts";
import "../styles/charts.css";

const months = [
  "",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthlySalesChart({ data }) {
  // normalize months Jan–Dec
  const monthMap = {};
  for (let i = 1; i <= 12; i++) {
    monthMap[i] = 1; // 🔑 minimum 1 for log scale
  }

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item._id >= 1 && item._id <= 12) {
        monthMap[item._id] = Number(item.totalSales);
      }
    });
  }

  const chartData = Object.keys(monthMap).map(m => ({
    month: months[m],
    sales: monthMap[m]
  }));

  const maxSales = Math.max(...chartData.map(d => d.sales));

  return (
    <div className="chart-card">
      <h3>Monthly Sales Analytics</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />

          {/* 🔥 LOG SCALE */}
          <YAxis
            scale="log"
            domain={["auto", "auto"]}
            tickFormatter={(value) =>
              value >= 1000 ? `${value / 1000}k` : value
            }
          />

          <Tooltip
            formatter={(value) =>
              value >= 1000 ? `${value / 1000}k` : value
            }
          />

          <Line
            type="monotone"
            dataKey="sales"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.sales === maxSales) {
                return (
                  <Dot
                    cx={cx}
                    cy={cy}
                    r={7}
                    fill="#22c55e"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                );
              }
              return <Dot cx={cx} cy={cy} r={4} fill="#60a5fa" />;
            }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
