{announcements.map(a => (
  <div key={a.id} className="card" style={{
    borderLeft: `4px solid ${priorityColor(a.priority)}`
  }}>
    <div className="flex-between" style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: '1rem' }}>{a.title}</strong>
        <span className={`badge ${
          a.priority === 'High'   ? 'badge-red'    :
          a.priority === 'Urgent' ? 'badge-purple' : 'badge-blue'
        }`}>{a.priority}</span>
        <span className="badge badge-gray">📣 {a.target}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {new Date(a.createdAt).toLocaleDateString()}
        </span>
        <button onClick={() => handleDelete(a.id)}
          className="btn btn-danger btn-sm">🗑️</button>
      </div>
    </div>
    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{a.message}</p>
  </div>

  <div className="grid-2">
  <div className="form-group">
    <label>Title *</label>
    <input required placeholder="Announcement title..."
      value={form.title}
      onChange={e => setForm({ ...form, title: e.target.value })} />
  </div>
  <div className="form-group">
    <label>Target Audience</label>
    <select value={form.target}
      onChange={e => setForm({ ...form, target: e.target.value })}>
      <option value="All">All</option>
      <option value="Students">Students</option>
      <option value="Teachers">Teachers</option>
    </select>
  </div>
</div>
<div className="form-group">
  <label>Message *</label>
  <textarea required rows="3" placeholder="Write your announcement here..."
    value={form.message}
    onChange={e => setForm({ ...form, message: e.target.value })} />
</div>
<div className="form-group" style={{ maxWidth: '200px' }}>
  <label>Priority</label>
  <select value={form.priority}
    onChange={e => setForm({ ...form, priority: e.target.value })}>
    <option value="Normal">Normal</option>
    <option value="High">High</option>
    <option value="Urgent">Urgent</option>
  </select>
</div>  
))}
