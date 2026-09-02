import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../services/socket";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import KpiCard from "../components/KpiCard";
import OrdersTable from "../components/OrdersTable";
import TopCustomersTable from "../components/TopCustomersTable";
import MonthlySalesChart from "../components/MonthlySalesChart";
import MonthlyOrdersChart from "../components/MonthlyOrdersChart";

import "../styles/dashboard.css";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [revenue, setRevenue] = useState(0);
  const [monthly, setMonthly] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [monthlyOrders, setMonthlyOrders] = useState([]);

  const loadData = async () => {
    const r = await api.get("/analytics/revenue");
    const m = await api.get("/analytics/monthly-sales");
    const c = await api.get("/analytics/top-customers");
    const o = await api.get("/orders");
    const mo = await api.get("/analytics/monthly-orders");

    setRevenue(r.data.totalRevenue);
    setMonthly(m.data);
    setTopCustomers(c.data);
    setOrders(o.data);
    setMonthlyOrders(mo.data);
  };

  useEffect(() => {
    loadData();
    socket.on("newOrder", loadData);
    return () => socket.off("newOrder");
  }, []);

  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar active={activePage} setActive={setActivePage} />

        <div className="content">
          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <div className="kpi-grid">
              <KpiCard title="Total Revenue" value={`₹ ${revenue}`} />
              <KpiCard title="Orders" value={orders.length} />
              <KpiCard title="Top Customers" value={topCustomers.length} />
            </div>
          )}

          {/* ANALYTICS */}
          {activePage === "analytics" && (
            <div className="charts-grid">
              <MonthlyOrdersChart data={monthlyOrders} />
              <MonthlySalesChart data={monthly} />
            </div>
          )}

          {/* TOP CUSTOMERS */}
          {activePage === "customers" && (
            <TopCustomersTable customers={topCustomers} />
          )}

          {/* ORDERS */}
          {activePage === "orders" && (
            <OrdersTable orders={orders} />
          )}
        </div>
      </div>
    </>
  );
}
