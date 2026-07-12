import { useLanguage } from '../../context/LanguageContext';

export default function MySchedule() {
  const { t } = useLanguage();

  const schedule = [
    { time: '8:00 AM',  subject: 'Mathematics', teacher: 'Mr. Sunil',  room: 'R101', day: 'Mon/Wed/Fri' },
    { time: '10:00 AM', subject: 'Science',     teacher: 'Ms. Dilani', room: 'R203', day: 'Tue/Thu'     },
    { time: '11:00 AM', subject: 'English',     teacher: 'Mr. Kamal',  room: 'R105', day: 'Mon/Tue/Wed' },
    { time: '1:00 PM',  subject: 'History',     teacher: 'Ms. Priya',  room: 'R301', day: 'Thu/Fri'     },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>📅 {t('classSchedule')}</h1>
      </div>
      <div className="grid-2">
        {schedule.map((s, i) => (
          <div key={s.subject} className="card">
            <div className="flex-between">
              <span className="badge badge-blue">{s.time}</span>
              <span className="badge badge-gray">{s.day}</span>
            </div>
            <div style={{ margin: '12px 0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{s.subject}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                👨‍🏫 {s.teacher} · 🚪 Room {s.room}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
