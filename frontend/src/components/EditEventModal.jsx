import { useState } from "react";
import axios from "axios";
import './EditEventModal.css';

const API = "http://localhost:5000/api/events";

export default function EditEventModal({ event, onUpdate, onCancel }) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [location, setLocation] = useState(event.location);
  const [capacity, setCapacity] = useState(event.capacity);
  const [ticketPrice, setTicketPrice] = useState(event.ticket_price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API}/${event.id}`, {
        title, description, date, location,
        capacity: parseInt(capacity),
        ticket_price: parseFloat(ticketPrice)
      });
      onUpdate(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="modal">
      <form className="event-form" onSubmit={handleSubmit}>
        <h3>Edit Event</h3>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required />
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required />
        <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required />
        <input type="number" placeholder="Capacity" value={capacity} onChange={e=>setCapacity(e.target.value)} required />
        <input type="number" step="0.01" placeholder="Ticket Price" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)} />
        <button type="submit">Update Event</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}
