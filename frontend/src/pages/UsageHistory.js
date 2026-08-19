import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UsageHistory() {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsageHistory();
  }, []);

  const fetchUsageHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsages(response.data);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>📋 Riwayat Penggunaan Semua Chemical</h2>

      <div className="table-container">
        {usages.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Chemical</th>
                <th>Kode</th>
                <th>Jumlah Digunakan</th>
                <th>Sisa</th>
                <th>Digunakan Oleh</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {usages.map(usage => (
                <tr key={usage._id}>
                  <td>{new Date(usage.usageDate).toLocaleDateString('id-ID')}</td>
                  <td>{usage.chemical.name}</td>
                  <td>{usage.chemical.code}</td>
                  <td>{usage.quantityUsed}</td>
                  <td>{usage.remainingQuantity}</td>
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
    </div>
  );
}

export default UsageHistory;
