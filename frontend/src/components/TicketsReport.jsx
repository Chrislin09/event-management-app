import { useEffect, useState } from "react";
import axios from "axios";
import "./TicketsReport.css";

const API = "http://localhost:5000/api/tickets/report";

export default function TicketsReport() {
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    try {
      const res = await axios.get(API);
      setReport(res.data);
    } catch (err) {
      console.error("Error fetching ticket report:", err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (!report) return <p>Loading ticket report...</p>;

  return (
    <div className="tickets-report">
      <div className="report-summary">
        <h2>Tickets Report</h2>
        <p><strong>Total Tickets Sold:</strong> {report.total_tickets}</p>
        <p><strong>Total Revenue:</strong> ₹{report.total_revenue}</p>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Event Title</th>
            <th>Tickets Sold</th>
            <th>Tickets Available</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>
        <tbody>
          {report.events.map((ev) => (
            <tr key={ev.event_id}>
              <td>{ev.title}</td>
              <td>{ev.tickets_sold}</td>
              <td>{ev.tickets_available}</td>
              <td>{ev.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
