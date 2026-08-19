import React, { useState } from 'react';

function RecordUsageModal({ onClose, onSubmit, maxQuantity, unit }) {
  const [formData, setFormData] = useState({
    quantityUsed: '',
    notes: '',
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

    if (!formData.quantityUsed) {
      setError('Jumlah penggunaan harus diisi');
      return;
    }

    if (parseFloat(formData.quantityUsed) > maxQuantity) {
      setError(`Jumlah penggunaan tidak boleh melebihi ${maxQuantity} ${unit}`);
      return;
    }

    if (parseFloat(formData.quantityUsed) <= 0) {
      setError('Jumlah penggunaan harus lebih dari 0');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Catat Penggunaan</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Jumlah Digunakan ({unit}) *</label>
            <input
              type="number"
              name="quantityUsed"
              value={formData.quantityUsed}
              onChange={handleChange}
              step="0.01"
              max={maxQuantity}
              placeholder={`Maksimal: ${maxQuantity} ${unit}`}
              required
            />
          </div>

          <div className="form-group">
            <label>Catatan</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh: Untuk eksperimen XYZ"
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
              Catat Penggunaan
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

export default RecordUsageModal;
