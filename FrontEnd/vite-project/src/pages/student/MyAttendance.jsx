import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import API from '../../api/axios';

export default function MyAttendance() {
  
  const { t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student id from user - for demo use student id 1
    API.get('/attendance/student/1')
      .then(res => setRecords(res.data))
      .catch(() => setRecords([
        { id: 1, date: '2026-05-12', status: 'Present' },
        { id: 2, date: '2026-05-13', status: 'Present' },
        { id: 3, date: '2026-05-14', status: 'Absent'  },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const total   = records.length;
  const present = records.filter(r => r.status === 'Present').length;
  const absent  = records.filter(r => r.status === 'Absent').length;
  const late    = records.filter(r => r.status === 'Late').length;
  const pct     = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div>
      <div className="page-header"><h1>✅ {t('viewAttendance')}</h1></div>

      <div className="stats-grid" style={{ marginBottom: '18px' }}>
        {[
          { label: 'Total',      value: total,   color: 'blue'   },
          { label: t('present'), value: present, color: 'green'  },
          { label: t('absent'),  value: absent,  color: 'red'    },
          { label: t('late'),    value: late,    color: 'yellow' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>📅</div>
            <div className="stat-info"><h3>{s.label}</h3><p>{s.value}</p></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '18px' }}>
        <h3>📊 Attendance Rate</h3>
        <div style={{ marginTop: '12px' }}>
          <div className="flex-between" style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: '600' }}>{pct}%</span>
            <span className={`badge ${pct >= 80 ? 'badge-green' : 'badge-red'}`}>
              {pct >= 80 ? 'Good' : 'Poor'}
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className={`progress-fill ${pct >= 80 ? 'progress-green' : 'progress-red'}`}
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card text-center"><p>{t('loading')}</p></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>{t('date')}</th><th>{t('status')}</th></tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      r.status === 'Present' ? 'badge-green' :
                      r.status === 'Absent'  ? 'badge-red'   : 'badge-yellow'
                    }`}>
                      {r.status === 'Present' ? t('present') :
                       r.status === 'Absent'  ? t('absent')  : t('late')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
