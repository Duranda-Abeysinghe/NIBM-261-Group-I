import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Schedule() {
  const { user } = useAuth(); 
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [viewMode, setViewMode] = useState("daily"); 
  const [filters, setFilters] = useState({
    date: "",
    subject: "",
    teacher: ""
  });
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    axios
      .get(`/api/schedule/teacher/${user.id}/classes`)
      .then(res => setClasses(res.data))
      .catch(() => setClasses([]));
  }, [user.id]);

  
  useEffect(() => {
    if (!selectedClassId) return;
    fetchSchedule();
    
  }, [selectedClassId, viewMode, filters]);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/schedule/class/${selectedClassId}`, {
        params: {
          view: viewMode,
          date: filters.date,
          subject: filters.subject,
          teacher: filters.teacher
        }
      });
      setSchedule(res.data);
    } catch {
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!selectedClassId) return;
    const interval = setInterval(fetchSchedule, 30000); // 30s
    return () => clearInterval(interval);
   
  }, [selectedClassId, viewMode, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>Class Schedule</h2>

    
      <div style={{ marginBottom: "10px" }}>
        <label>Class: </label>
        <select
          value={selectedClassId}
          onChange={e => setSelectedClassId(e.target.value)}
        >
          <option value="">-- Select Class --</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setViewMode("daily")}
          style={{ marginRight: "5px", background: viewMode === "daily" ? "#2563eb" : "#eee" }}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode("weekly")}
          style={{ marginRight: "5px", background: viewMode === "weekly" ? "#2563eb" : "#eee" }}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          style={{ background: viewMode === "monthly" ? "#2563eb" : "#eee" }}
        >
          Monthly
        </button>
      </div>

   
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>Subject: </label>
          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            placeholder="Math, Science..."
          />
        </div>
        <div>
          <label>Teacher: </label>
          <input
            type="text"
            name="teacher"
            value={filters.teacher}
            onChange={handleFilterChange}
            placeholder="Teacher name"
          />
        </div>
      </div>

      
      {loading ? (
        <p>Loading schedule...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No schedule found</td>
              </tr>
            ) : (
              schedule.map(item => (
                <tr key={item.id}>
                  <td>{item.startTime} - {item.endTime}</td>
                  <td>{item.subject}</td>
                  <td>{item.teacherName}</td>
                  <td>{item.room}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
