import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import API from '../../api/axios';

export default function MyRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [success,  setSuccess]  = useState('');
  const [error,    setError]    = useState('');
  const [form, setForm] = useState({ type: 'Leave Request', message: '' });

  useEffect(() => {
    API.get('/requests/student/1')
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await API.post('/requests', {
        studentId: 1,
        type:      form.type,
        message:   form.message,
        fileUrl:   '',
        status:    'Pending'
      });
      setRequests(p => [res.data.data, ...p]);
      setForm({ type: 'Leave Request', message: '' });
      setShowForm(false);
      setSuccess('Request submitted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to submit request.');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s) =>
    s === 'Pending' ? 'badge-yellow' : s === 'Approved' ? 'badge-green' : 'badge-red';

  const borderColor = (s) =>
    s === 'Pending' ? '#f59e0b' : s === 'Approved' ? '#16a34a' : '#dc2626';

  return (
    <div>
      <div className="page-header">
        <h1>📨 {t('submitRequest')}</h1>
        <button className="btn btn-primary"
          onClick={() => { setShowForm(!showForm); setError(''); }}>
          {showForm ? `✕ ${t('cancel')}` : `➕ New Request`}
        </button>
      </div>

      

      {loading ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <p style={{ color: '#94a3b8' }}>⏳ Loading requests...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {requests.map(r => (
            <div key={r.id} className="card" style={{
              borderLeft: `4px solid ${borderColor(r.status)}`
            }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{r.type}</strong>
                  <span className={`badge ${statusColor(r.status)}`}>{r.status}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{r.message}</p>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="card text-center" style={{ padding: '40px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📨</div>
              <p style={{ color: '#94a3b8' }}>No requests yet. Submit your first request!</p>
              <button className="btn btn-primary" style={{ marginTop: '12px' }}
                onClick={() => setShowForm(true)}>
                ➕ Submit Request
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
