import { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Trash2, Search } from "lucide-react"; // icons
import EditEventModal from "./EditEventModal";
import "./EventList.css";

const API = "http://localhost:5000/api/events";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(API);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Update event in list after edit
  const handleUpdate = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setEditingEvent(null);
  };

  // Filtered events based on search term
  const filteredEvents = events.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      e.location.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Search bar */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search events by title, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table border="1" cellPadding="5" className="event-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Ticket Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((e) => (
              <tr key={e.id}>
                <td>{e.title}</td>
                <td>{e.description}</td>
                <td>{new Date(e.date).toLocaleString()}</td>
                <td>{e.location}</td>
                <td>{e.capacity}</td>
                <td>{e.ticket_price}</td>
                <td className="action-buttons">
                  <button
                    className="icon-btn edit"
                    onClick={() => setEditingEvent(e)}
                    title="Edit Event"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => deleteEvent(e.id)}
                    title="Delete Event"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#888" }}>
                No matching events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onUpdate={handleUpdate}
          onCancel={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
