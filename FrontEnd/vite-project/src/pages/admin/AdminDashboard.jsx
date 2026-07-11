{data.announcements.slice(0, 3).map(a => (
  <div key={a.id} style={{
    background: a.priority === 'High' ? '#fff5f5' : a.priority === 'Urgent' ? '#faf5ff' : '#f0f9ff',
    borderRadius: '12px', padding: '14px',
    borderLeft: `3px solid ${a.priority === 'High' ? '#dc2626' : a.priority === 'Urgent' ? '#7c3aed' : '#2563eb'}`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
      <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>{a.title}</strong>
      <span className={`badge ${a.priority === 'High' ? 'badge-red' : a.priority === 'Urgent' ? 'badge-purple' : 'badge-blue'}`} style={{ fontSize: '0.68rem' }}>
        {a.priority}
      </span>
    </div>
    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
      {a.message}
    </p>
  </div>
))}
