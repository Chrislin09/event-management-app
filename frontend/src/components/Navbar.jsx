import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Event Manager</h2>
      <ul className="nav-links">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to="/eventform" className={({ isActive }) => isActive ? "active" : ""}>Add Event</NavLink></li>
        <li><NavLink to="/eventlist" className={({ isActive }) => isActive ? "active" : ""}>Event List</NavLink></li>
        <li><NavLink to="/attendee" className={({ isActive }) => isActive ? "active" : ""}>Attendees</NavLink></li>
        <li><NavLink to="/tickets" className={({ isActive }) => isActive ? "active" : ""}>Ticket Tracking</NavLink></li>
        <li><NavLink to="/importcsv" className={({ isActive }) => isActive ? "active" : ""}>Import CSV</NavLink></li>
      </ul>
    </nav>
  );
}
