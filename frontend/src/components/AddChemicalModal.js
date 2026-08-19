import React, { useState } from 'react';

function AddChemicalModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    casNumber: '',
    storageLocation: '',
    expiredDate: '',
    quantity: '',
    unit: 'ml',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.code || !formData.casNumber || !formData.storageLocation || !formData.expiredDate || !formData.quantity) {
      setError('Semua field harus diisi');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Tambah Chemical Baru</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Chemical *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Kode Chemical *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CAS Number *</label>
            <input
              type="text"
              name="casNumber"
              value={formData.casNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lokasi Penyimpanan *</label>
            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              placeholder="Contoh: Lemari A3, Rak 2"
              required
            />
          </div>

          <div className="form-group">
            <label>Tanggal Expired *</label>
            <input
              type="date"
              name="expiredDate"
              value={formData.expiredDate}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="ml">ml</option>
                <option value="L">L</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
              Tambah Chemical
            </button>
            <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={onClose}>
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChemicalModal;
