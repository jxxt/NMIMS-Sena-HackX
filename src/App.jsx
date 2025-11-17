import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserEvents from "./pages/UserEvents";
import Invite from "./pages/Invite";
import EventDetails from "./pages/EventDetails";
import RSVPList from "./pages/RSVPList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/events" element={<UserEvents />} />
                <Route path="/invite" element={<Invite />} />
                <Route path="/event/:eventId" element={<EventDetails />} />
                <Route path="/rsvp/:eventId" element={<RSVPList />} />
            </Routes>
        </Router>
    );
}

export default App;
