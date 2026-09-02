import "../styles/Card.css";

export default function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
