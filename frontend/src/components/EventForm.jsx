import { useState } from "react";
import axios from "axios";
import './EventForm.css';

const API = "http://localhost:5000/api/events";

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API, {
        title,
        description,
        date,
        location,
        capacity: parseInt(capacity),
        ticket_price: parseFloat(ticketPrice)
      });
      alert("Event created successfully!");
      setTitle(""); setDescription(""); setDate(""); setLocation(""); setCapacity(""); setTicketPrice("");
      onEventCreated(res.data); // refresh parent list
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required />
      <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required />
      <input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} required />
      <input type="number" placeholder="Capacity" value={capacity} onChange={e=>setCapacity(e.target.value)} required />
      <input type="number" step="0.01" placeholder="Ticket Price" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)} />
      <button type="submit">Create Event</button>
    </form>
  );
}
