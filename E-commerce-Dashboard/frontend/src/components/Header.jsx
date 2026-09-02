import "../styles/header.css";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="topbar">
      <div className="logo">
        <h2 className="text-2xl brand-gradient">
  ShopSphere
</h2>


      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
