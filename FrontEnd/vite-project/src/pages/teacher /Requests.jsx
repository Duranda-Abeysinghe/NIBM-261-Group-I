import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

export default function Requests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Review modal state
  const [selected, setSelected] = useState(null);
  const [comment, setComment]   = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);
  
  const fetchRequests = () => {
    setLoading(true);
    API.get('/requests')
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /*const updateStatus = async (id, status) => {
    try {
      await API.put(`/requests/${id}/status`, JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
      });
      setRequests(p => p.map(r => r.id === id ? { ...r, status } : r));
    } catch { alert('Failed to update.'); }
  };*/

  // Updated: send an object { status, comment }
  const updateStatus = async (id, status, commentText = '') => {
    try {
      setSaving(true);
      await API.put(`/requests/${id}/status`, { status, comment: commentText });
      // update local state
      setRequests(p => p.map(r => r.id === id ? { ...r, status } : r));
      // clear modal
      setSelected(null);
      setComment('');
    } catch (err) { alert('Failed to update.'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>📨 {t('viewRequests')}</h1>
        <span className="badge badge-yellow">
          {requests.filter(r => r.status === 'Pending').length} {t('pendingRequests')}
        </span>
      </div>

      {loading ? (
        <div className="card text-center"><p>{t('loading')}</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {requests.map(r => (
            <div key={r.id} className="card" style={{
              borderLeft: `4px solid ${
                r.status === 'Pending'  ? '#f59e0b' :
                r.status === 'Approved' ? '#16a34a' : '#dc2626'
              }`
            }}>
              <div className="flex-between" style={{ marginBottom: '10px' }}>
                <div>
                  <strong>{r.student?.name || r.studentName || 'Student'}</strong>
                  <span className="badge badge-purple" style={{ marginLeft: '10px' }}>{r.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`badge ${
                    r.status === 'Pending'  ? 'badge-yellow' :
                    r.status === 'Approved' ? 'badge-green'  : 'badge-red'
                  }`}>{r.status}</span>
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '12px' }}>
                {r.message}
              </p>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button className="btn btn-outline btn-sm"
                  onClick={() => { setSelected(r); setComment(''); }}>
                  🔍 Review
                </button>
                
              {r.status === 'Pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-success btn-sm"
                    onClick={() => updateStatus(r.id, 'Approved')}>
                    ✅ {t('approve')}
                  </button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => updateStatus(r.id, 'Rejected')}>
                    ❌ {t('reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
          {requests.length === 0 && (
            <div className="card text-center">
              <p style={{ color: '#94a3b8' }}>No requests found.</p>
            </div>
          )}
        </div>
      )}

      {/* Simple Review Modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200
        }}>
          <div style={{ width: 640, maxWidth: '95%', background: 'white', borderRadius: 8, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Review Request</h3>
              <button onClick={() => setSelected(null)} className="btn btn-ghost">✕</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>{selected.student?.name || selected.studentName || 'Student'}</strong>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 6 }}>{selected.type}</div>
              <p style={{ marginTop: 12 }}>{selected.message}</p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Comment / Reason (optional)</label>
              <textarea rows="4" value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-danger"
                onClick={() => updateStatus(selected.id, 'Rejected', comment)}
                disabled={saving}>
                ❌ Reject
              </button>
              <button className="btn btn-success"
                onClick={() => updateStatus(selected.id, 'Approved', comment)}
                disabled={saving}>
                ✅ Approve
              </button>
            </div>
          </div>
        </div>
      )}
          
    </div>
  );
}
