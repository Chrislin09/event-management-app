import { useState, useEffect } from "react";
import axios from "axios";
import "./AttendeeForm.css";

const EVENTS_API = "http://localhost:5000/api/events";
const ATTENDEES_API = "http://localhost:5000/api/attendees";

export default function AttendeeForm() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(EVENTS_API);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Fetch attendees for selected event
  const fetchAttendees = async (eventId) => {
    try {
      const res = await axios.get(`${ATTENDEES_API}/event/${eventId}`);
      setAttendees(res.data);
    } catch (err) {
      console.error("Error fetching attendees:", err);
      setAttendees([]);
    }
  };

  // Handle event selection
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    if (eventId) fetchAttendees(eventId);
    else setAttendees([]);
  };

  // Register new attendee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(false);

    if (!selectedEventId) {
      setMessage("Please select an event first!");
      setError(true);
      return;
    }

    try {
      await axios.post(`${ATTENDEES_API}/event/${selectedEventId}`, {
        name,
        email,
      });
      setMessage("Attendee registered successfully!");
      setError(false);
      setName("");
      setEmail("");
      fetchAttendees(selectedEventId); // refresh attendee list
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to register attendee";
      setMessage(msg);
      setError(true);
    }
  };

  return (
    <div className="attendee-container">
      <form className="attendee-form" onSubmit={handleSubmit}>
        <h3>Register Attendee</h3>

        <select
          value={selectedEventId}
          onChange={handleEventChange}
          required
        >
          <option value="">-- Select Event --</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({new Date(e.date).toLocaleDateString()})
            </option>
          ))}
        </select>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        {message && (
          <p className={error ? "message error" : "message success"}>
            {message}
          </p>
        )}
      </form>

      {/* Attendee list */}
      {selectedEventId && (
        <div className="attendee-list">
          <h3>Attendees for Selected Event</h3>
          {attendees.length > 0 ? (
            <table className="attendee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendees registered yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
