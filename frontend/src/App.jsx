import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import AttendeeForm from "./components/AttendeeForm";
import TicketTracking from "./components/TicketsReport";
import CSVUpload from "./components/CSVUpload";
import TicketsReport from "./components/TicketsReport";
import Home from "./components/Home";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/eventform" element={<EventForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/eventlist" element={<EventList />} />
          <Route path="/attendee" element={<AttendeeForm />} />
          <Route path="/tickets" element={<TicketsReport />} />
          <Route path="/importcsv" element={<CSVUpload />} />
        </Routes>
      </div>
    </Router>
  );
}
