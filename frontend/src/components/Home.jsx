import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Event Manager</h1>
        <p>Plan, organize, and track your events with ease.</p>
        <Link to="/eventform" className="cta-btn">Create New Event</Link>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3> Event List</h3>
          <p>View and manage all your events from one place.</p>
          <Link to="/eventlist" className="feature-btn">Go</Link>
        </div>

        <div className="feature-card">
          <h3> Attendees</h3>
          <p>Manage your attendees and book your events easily.</p>
          <Link to="/attendee" className="feature-btn">View</Link>
        </div>

        <div className="feature-card">
          <h3>Ticket Tracking</h3>
          <p>Monitor ticket sales and check event performance.</p>
          <Link to="/tickets" className="feature-btn">Track</Link>
        </div>

        <div className="feature-card">
          <h3>Import CSV</h3>
          <p>Bulk upload events quickly using a CSV file.</p>
          <Link to="/importcsv" className="feature-btn">Upload</Link>
        </div>
      </section>
    </div>
  );
}
