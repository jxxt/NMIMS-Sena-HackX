import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RSVPList = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [attendees, setAttendees] = useState([]);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch event details
                const eventResponse = await fetch(
                    `https://eventverse-backend.onrender.com/api/events/${eventId}`
                );
                
                if (eventResponse.ok) {
                    const eventResult = await eventResponse.json();
                    setEventData(eventResult);
                }

                // Fetch RSVPs
                const rsvpResponse = await fetch(
                    `https://eventverse-backend.onrender.com/api/rsvp/${eventId}`
                );

                if (!rsvpResponse.ok) {
                    throw new Error("Failed to fetch RSVPs");
                }

                const result = await rsvpResponse.json();
                
                // Convert object to array if needed
                const attendeesList = result.attendees 
                    ? (Array.isArray(result.attendees) 
                        ? result.attendees 
                        : Object.values(result.attendees))
                    : [];
                
                setAttendees(attendeesList);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const attendingCount = attendees.filter(
        (attendee) => attendee.response === "I will attend"
    ).length;

    const notAttendingCount = attendees.filter(
        (attendee) => attendee.response === "No, won't join"
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-950">
                <div className="text-white text-xl">Loading RSVPs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-950">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-6xl bg-gray-900 rounded-xl shadow-2xl p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-bold text-white">
                        RSVP List
                    </h2>
                    <button
                        onClick={() => navigate("/events")}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                        Back to Events
                    </button>
                </div>

                {eventData && (
                    <div className="bg-gray-800 rounded-lg p-6 space-y-2">
                        <h3 className="text-2xl font-bold text-white">
                            {eventData.eventName}
                        </h3>
                        <p className="text-gray-400">
                            {eventData.eventDescription}
                        </p>
                        <p className="text-gray-400">
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(eventData.eventDate).toLocaleDateString()}{" "}
                            at {new Date(eventData.eventDate).toLocaleTimeString()}
                        </p>
                        <p className="text-gray-400">
                            <span className="font-semibold">Location:</span>{" "}
                            {eventData.eventLocation}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-6 text-center">
                        <p className="text-gray-400 text-sm uppercase tracking-wide">
                            Total RSVPs
                        </p>
                        <p className="text-4xl font-bold text-white mt-2">
                            {attendees.length}
                        </p>
                    </div>
                    <div className="bg-green-900 rounded-lg p-6 text-center">
                        <p className="text-green-200 text-sm uppercase tracking-wide">
                            Attending
                        </p>
                        <p className="text-4xl font-bold text-white mt-2">
                            {attendingCount}
                        </p>
                    </div>
                    <div className="bg-red-900 rounded-lg p-6 text-center">
                        <p className="text-red-200 text-sm uppercase tracking-wide">
                            Not Attending
                        </p>
                        <p className="text-4xl font-bold text-white mt-2">
                            {notAttendingCount}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">
                        Attendee List
                    </h3>
                    {attendees.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider">
                                            Response
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {attendees.map((attendee, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-750 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-white">
                                                {attendee.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {attendee.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                        attendee.response ===
                                                        "I will attend"
                                                            ? "bg-green-900 text-green-200"
                                                            : "bg-red-900 text-red-200"
                                                    }`}
                                                >
                                                    {attendee.response}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-lg p-8 text-center">
                            <p className="text-gray-400 text-lg">
                                No RSVPs yet for this event.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RSVPList;
