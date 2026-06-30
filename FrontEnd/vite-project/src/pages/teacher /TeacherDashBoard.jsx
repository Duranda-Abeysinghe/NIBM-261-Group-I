import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import API from '../../api/axios';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requests,  setRequests]  = useState([]);
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([API.get('/requests'), API.get('/students')])
      .then(([r, s]) => { setRequests(r.data); setStudents(s.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  const myClasses = [
    { name: 'Grade 10A', subject: 'Mathematics', students: 35, time: '8:00 AM',  day: 'Mon/Wed/Fri', color: '#2563eb' },
    { name: 'Grade 11B', subject: 'Mathematics', students: 28, time: '10:00 AM', day: 'Tue/Thu',     color: '#7c3aed' },
    { name: 'Grade 9C',  subject: 'Mathematics', students: 30, time: '1:00 PM',  day: 'Mon/Wed',     color: '#16a34a' },
  ];

  const todaySchedule = [
    { time: '8:00 AM',  class: 'Grade 10A', room: 'R101', subject: 'Mathematics' },
    { time: '10:00 AM', class: 'Grade 11B', room: 'R102', subject: 'Mathematics' },
    { time: '1:00 PM',  class: 'Grade 9C',  room: 'R103', subject: 'Mathematics' },
  ];

  return (
    <div>
      {/* ===== WELCOME BANNER ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)',
        borderRadius: '20px', padding: '26px 30px', marginBottom: '24px',
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.85rem', opacity: 0.8 }}>
              👨‍🏫 {new Date().getHours() < 12 ? 'Good Morning' : 'Good Afternoon'}
            </p>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: '800', color: 'white' }}>
              {user?.name}
            </h1>
            <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.8 }}>
              Teacher Panel · {new Date().toDateString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Classes',  value: myClasses.length },
              { label: 'Students', value: students.length  },
              { label: 'Pending',  value: pendingRequests  },
            ].map(item => (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: '12px',
                padding: '10px 16px', textAlign: 'center', minWidth: '70px'
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{item.value}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
