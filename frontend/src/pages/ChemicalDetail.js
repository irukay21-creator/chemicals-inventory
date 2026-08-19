import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecordUsageModal from '../components/RecordUsageModal';

function ChemicalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chemical, setChemical] = useState(null);
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchChemicalDetail();
    fetchUsageHistory();
  }, [id]);

  const fetchChemicalDetail = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/chemicals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChemical(response.data);
    } catch (error) {
      console.error('Error fetching chemical:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usage/chemical/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsageHistory(response.data);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    }
  };

  const handleRecordUsage = async (usageData) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/usage`, {
        chemicalId: id,
        ...usageData,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowUsageModal(false);
      fetchChemicalDetail();
      fetchUsageHistory();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!chemical) {
    return <div className="loading">Chemical tidak ditemukan</div>;
  }

  return (
    <div className="dashboard">
      <button onClick={() => navigate('/dashboard')} className="btn" style={{ marginBottom: '1rem' }}>
        ← Kembali
      </button>

      <div className="form-container">
        <h2>{chemical.name}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <p><strong>Kode:</strong> {chemical.code}</p>
            <p><strong>CAS Number:</strong> {chemical.casNumber}</p>
            <p><strong>Lokasi Penyimpanan:</strong> {chemical.storageLocation}</p>
          </div>
          <div>
            <p><strong>Sisa Quantity:</strong> {chemical.quantity} {chemical.unit}</p>
            <p><strong>Expired Date:</strong> {new Date(chemical.expiredDate).toLocaleDateString('id-ID')}</p>
            <p>
              <strong>Status:</strong> 
              <span className={`status-badge status-${chemical.status}`} style={{ marginLeft: '0.5rem' }}>
                {chemical.status.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        <button 
          className="btn btn-success"
          onClick={() => setShowUsageModal(true)}
          disabled={chemical.status !== 'active'}
        >
          📝 Catat Penggunaan
        </button>
      </div>

      {/* Usage History */}
      <div className="table-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ padding: '1rem 1rem 0 1rem' }}>📋 Riwayat Penggunaan</h3>
        {usageHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jumlah Digunakan</th>
                <th>Sisa</th>
                <th>Digunakan Oleh</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map(usage => (
                <tr key={usage._id}>
                  <td>{new Date(usage.usageDate).toLocaleDateString('id-ID')}</td>
                  <td>{usage.quantityUsed} {chemical.unit}</td>
                  <td>{usage.remainingQuantity} {chemical.unit}</td>
                  <td>{usage.usedBy.name}</td>
                  <td>{usage.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Belum ada riwayat penggunaan
          </div>
        )}
      </div>

      {showUsageModal && (
        <RecordUsageModal 
          onClose={() => setShowUsageModal(false)}
          onSubmit={handleRecordUsage}
          maxQuantity={chemical.quantity}
          unit={chemical.unit}
        />
      )}
    </div>
  );
}

export default ChemicalDetail;
