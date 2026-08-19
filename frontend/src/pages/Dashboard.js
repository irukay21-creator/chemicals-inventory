import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AddChemicalModal from '../components/AddChemicalModal';

function Dashboard() {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchChemicals();
  }, []);

  const fetchChemicals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/chemicals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChemicals(response.data);
    } catch (error) {
      console.error('Error fetching chemicals:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddChemical = async (chemicalData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/chemicals`, chemicalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchChemicals();
    } catch (error) {
      console.error('Error adding chemical:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus chemical ini?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/chemicals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchChemicals();
      } catch (error) {
        console.error('Error deleting chemical:', error);
      }
    }
  };

  const filteredChemicals = chemicals.filter(chemical => {
    const matchSearch = chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       chemical.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === 'all' || chemical.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: chemicals.length,
    active: chemicals.filter(c => c.status === 'active').length,
    expired: chemicals.filter(c => c.status === 'expired').length,
    empty: chemicals.filter(c => c.status === 'empty').length,
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📦 Inventory Chemicals</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Tambah Chemical
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card">
          <h3>Total Chemical</h3>
          <div className="value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <h3>Aktif</h3>
          <div className="value" style={{ color: '#27ae60' }}>{stats.active}</div>
        </div>
        <div className="stat-card">
          <h3>Expired</h3>
          <div className="value" style={{ color: '#e74c3c' }}>{stats.expired}</div>
        </div>
        <div className="stat-card">
          <h3>Kosong</h3>
          <div className="value" style={{ color: '#95a5a6' }}>{stats.empty}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Cari nama atau kode chemical..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="expired">Expired</option>
          <option value="empty">Kosong</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {filteredChemicals.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Kode</th>
                <th>CAS Number</th>
                <th>Lokasi</th>
                <th>Sisa</th>
                <th>Expired</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredChemicals.map(chemical => (
                <tr key={chemical._id}>
                  <td>{chemical.name}</td>
                  <td>{chemical.code}</td>
                  <td>{chemical.casNumber}</td>
                  <td>{chemical.storageLocation}</td>
                  <td>{chemical.quantity} {chemical.unit}</td>
                  <td>{new Date(chemical.expiredDate).toLocaleDateString('id-ID')}</td>
                  <td>
                    <span className={`status-badge status-${chemical.status}`}>
                      {chemical.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <Link to={`/chemical/${chemical._id}`} className="btn" style={{ marginRight: '0.5rem', display: 'inline-block' }}>
                      Detail
                    </Link>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(chemical._id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Tidak ada chemical yang ditemukan
          </div>
        )}
      </div>

      {showModal && (
        <AddChemicalModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleAddChemical}
        />
      )}
    </div>
  );
}

export default Dashboard;
