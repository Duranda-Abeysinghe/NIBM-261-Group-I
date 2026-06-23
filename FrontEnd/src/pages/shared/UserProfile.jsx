import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', role: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, role: user.role });
      setNewName(user.name);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

// SCRUM-85: Form validation rules
    if (!newName.trim()) {
      setError('Name field cannot be left blank.');
      return;
    }
    if (newName.trim().length < 3) {
      setError('Name must be at least 3 characters long.');
      return;
    }
    setLoading(true);
    try {
      // SCRUM-88: Hitting the backend profile update handler
      const response = await API.put(`/auth/profile/update`, { name: newName.trim() });
      
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
    
return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <div className="page-header">
        <h1>👤 Account Profile Settings</h1>
      </div>
      
      {success && <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '12px' }}>✅ {success}</div>}
      {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '12px' }}>❌ {error}</div>}

      <div className="card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Email Address</label>
          <input type="text" disabled value={profile.email} style={{ width: '100%', padding: '8px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'not-allowed' }} />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Account Authority Role</label>
          <span style={{ display: 'inline-block', padding: '4px 10px', background: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 'bold' }}>{profile.role}</span>
        </div>

        <form onSubmit={handleUpdate}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>Display Name</label>
            <input 
              type="text" 
              disabled={!isEditing} 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', background: isEditing ? '#fff' : '#f9fafb' }} 
            />
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => { setIsEditing(false); setNewName(profile.name); }}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile Info
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
