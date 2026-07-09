import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Attendance() {
  const { user } = useAuth(); // teacher info
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  // 1. Load teacher assigned classes
  useEffect(() => {
    axios
      .get(`/api/teacher/${user.id}/classes`)
      .then((res) => setClasses(res.data))
      .catch(() => setMessage("Failed to load classes"));
  }, [user.id]);

  // 2. Load student list when class is selected
  const loadStudents = (classId) => {
    setSelectedClass(classId);
    axios
      .get(`/api/classes/${classId}/students`)
      .then((res) => {
        setStudents(res.data);
        setAttendance({});
      })
      .catch(() => setMessage("Failed to load students"));
  };

  // 3. Mark attendance
  const markAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // 4. Validate attendance entries
  const validateAttendance = () => {
    if (students.length === 0) return false;
    if (Object.keys(attendance).length !== students.length) {
      setMessage("Please mark attendance for all students");
      return false;
    }
    return true;
  };

  // 5. Save attendance
  const saveAttendance = () => {
    if (!validateAttendance()) return;

    axios
      .post(`/api/attendance/save`, {
        classId: selectedClass,
        teacherId: user.id,
        records: attendance,
      })
      .then(() => setMessage("Attendance saved successfully"))
      .catch(() => setMessage("Failed to save attendance"));
  };

  return (
    <div>
      <h2>Teacher Attendance Marking</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Class Selection */}
      <div>
        <label>Select Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => loadStudents(e.target.value)}
        >
          <option value="">-- Select --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Student List */}
      {students.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id}>
                <td>{stu.name}</td>
                <td>
                  <input
                    type="radio"
                    name={`att-${stu.id}`}
                    onChange={() => markAttendance(stu.id, "Present")}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`att-${stu.id}`}
                    onChange={() => markAttendance(stu.id, "Absent")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Save Button */}
      {students.length > 0 && (
        <button
          onClick={saveAttendance}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Save Attendance
        </button>
      )}
    </div>
  );
}
