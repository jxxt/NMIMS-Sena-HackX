import { useEffect, useState } from "react";
import { db, ref, get } from "../config/firebase";
import { useParams } from "react-router-dom";

const EventDetails = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);

    useEffect(() => {
        const fetchEventDetails = async () => {
            const eventRef = ref(db, `events/${eventId}`);
            const eventSnapshot = await get(eventRef);

            if (eventSnapshot.exists()) {
                setEventData(eventSnapshot.val());
            }
        };

        fetchEventDetails();
    }, [eventId]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-3xl bg-gray-900 rounded-xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Event Details (JSON)
                </h2>
                <pre className="bg-gray-800 text-gray-300 p-4 rounded-lg overflow-auto">
                    {eventData
                        ? JSON.stringify(eventData, null, 2)
                        : "Loading..."}
                </pre>
            </div>
        </div>
    );
};

export default EventDetails;
