import "../styles/sidebar.css";

export default function Sidebar({ active, setActive }) {
  return (
    <div className="sidebar">

      <div className="sidebar-brand">
        <img src="/logo.png" alt="ShopSphere Logo" />
        <h2 className="text-2xl font-bold tracking-wide font-brand">
  ShopSphere
</h2>

      </div>

      <button
        className={active === "dashboard" ? "active" : ""}
        onClick={() => setActive("dashboard")}
      >
        Dashboard
      </button>

      <button
        className={active === "analytics" ? "active" : ""}
        onClick={() => setActive("analytics")}
      >
        Analytics
      </button>

      <button
        className={active === "customers" ? "active" : ""}
        onClick={() => setActive("customers")}
      >
        Top Customers
      </button>

      <button
        className={active === "orders" ? "active" : ""}
        onClick={() => setActive("orders")}
      >
        Orders
      </button>

    </div>
  );
}
