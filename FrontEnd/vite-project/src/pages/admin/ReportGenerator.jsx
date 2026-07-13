import { useState } from "react";
import axios from "axios";

export default function ReportGenerator() {
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const generateReport = async () => {
    if (!reportType) {
      alert("Please select a report type");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/api/reports/generate/${reportType}`, {
        responseType: "blob"
      });

      const url = URL.createObjectURL(res.data);
      setPdfUrl(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Reports</h2>

      <select
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="">-- Select Report --</option>
        <option value="attendance">Attendance Report</option>
        <option value="schedule">Class Schedule Report</option>
        <option value="students">Student List Report</option>
      </select>

      <button onClick={generateReport} style={{ marginLeft: "10px" }}>
        Generate
      </button>

      {loading && <p>Generating report...</p>}

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="Generated Report"
        ></iframe>
      )}
    </div>
  );
}
