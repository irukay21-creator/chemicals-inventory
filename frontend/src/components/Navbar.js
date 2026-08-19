import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div>
        <h1>🧪 Chemicals Inventory</h1>
        <p style={{ fontSize: '12px', margin: '0.25rem 0 0 0' }}>Workspace: {user.workspace?.name}</p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/usage-history" style={{ color: 'white', textDecoration: 'none' }}>Riwayat</Link>
        <span style={{ color: '#bdc3c7' }}>|</span>
        <span style={{ color: '#ecf0f1' }}>👤 {user.name}</span>
        <button onClick={handleLogout} className="btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
