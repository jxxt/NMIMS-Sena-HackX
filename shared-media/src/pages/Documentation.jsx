import React, { useRef, useState, useEffect } from "react";
import { Copy, Check, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Documentation = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reference for all sections
  const introRef = useRef(null);
  const frontendRef = useRef(null);
  const backendRef = useRef(null);
  const modelsRef = useRef(null);
  const emailRef = useRef(null);
  const rsvpRef = useRef(null);
  const eventsRef = useRef(null);
  const utilityRef = useRef(null);

  const sections = [
    { id: 'introduction', title: 'Introduction', ref: introRef },
    { id: 'frontend', title: 'Frontend API', ref: frontendRef },
    { id: 'backend', title: 'Backend Setup', ref: backendRef },
    { id: 'models', title: 'Data Models', ref: modelsRef },
    { id: 'email', title: 'Email Service', ref: emailRef },
    { id: 'rsvp', title: 'RSVP Endpoints', ref: rsvpRef },
    { id: 'events', title: 'Event Endpoints', ref: eventsRef },
    { id: 'utility', title: 'Utility Functions', ref: utilityRef }
  ];

  // Example code snippets
  const modelCode = `class Event(BaseModel):
    eventName: str
    eventDescription: str
    eventDate: str  # ISO 8601 format
    eventLocation: str
    eventHostId: str
    eventHostApiKey: str
    eventStatus: str = Field(default="incomplete")

class RSVPData(BaseModel):
    event_id: str
    name: str
    email: EmailStr
    response: str`;

  const createEventCode = `@app.post("/events/")
async def create_event(event: Event):
    try:
        event_id = generate_unique_event_id()
        ref = db.reference('events')
        event_data = event.dict()
        ref.child(event_id).set(event_data)
        return {"eventId": event_id, "message": "Event created successfully"}
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create event: {str(e)}")`;

  const rsvpCode = `@app.post("/api/rsvp")
async def submit_rsvp(rsvp_data: RSVPData):
    try:
        ref = db.reference(f'attendees/{rsvp_data.event_id}')
        ref.child(rsvp_data.email.replace('.', ',')).set({
            "name": rsvp_data.name,
            "email": rsvp_data.email,
            "response": rsvp_data.response,
            "timestamp": datetime.now().isoformat()
        })
        
        if rsvp_data.response == "I will attend":
            event_ref = db.reference(f'events/{rsvp_data.event_id}')
            event_data = event_ref.get()
            email_sent = await send_confirmation_email(event_data, rsvp_data)
            
            return {
                "status": "success",
                "message": "RSVP submitted and confirmation email sent",
                "emailSent": email_sent
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit RSVP: {str(e)}")`;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      sections.forEach(({ id, ref }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= windowHeight / 3 && rect.bottom >= windowHeight / 3) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const scrollToSection = (ref, id) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    setIsSidebarOpen(false);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const EndpointCard = ({ method, endpoint, description, requestBody, response }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${method === 'GET' ? 'bg-green-100 text-green-800' :
          method === 'POST' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'}`}>
          {method}
        </span>
        <code className="text-gray-700">{endpoint}</code>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {requestBody && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Request Body:</h4>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
            <code>{JSON.stringify(requestBody, null, 2)}</code>
          </pre>
        </div>
      )}
      {response && (
        <div>
          <h4 className="font-medium mb-2">Response:</h4>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );

  const CodeBlock = ({ code, title }) => (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-gray-900 text-white p-6 rounded-lg font-mono relative mt-4"
    >
      <div className="absolute top-3 left-3 flex space-x-2">
        <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-red-500 rounded-full" />
        <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-yellow-500 rounded-full" />
        <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleCopy(code)}
        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-800"
      >
        {showCopied ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : (
          <Copy className="w-5 h-5" />
        )}
      </motion.button>
      <pre className="overflow-x-auto mt-6">
        <code className="text-sm">{code}</code>
      </pre>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex max-w-6xl mx-auto mt-10"
    >
      <AnimatePresence>
        <motion.div
          initial="closed"
          animate={isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed lg:relative z-10 lg:w-1/4 h-full lg:h-auto lg:translate-x-0 bg-gray-900 lg:bg-gray-100 lg:shadow-lg lg:rounded-lg p-6 text-white lg:text-black lg:sticky top-20"
        >
          <motion.div className="absolute left-0 w-1 h-full bg-gray-300">
            <motion.div 
              className="w-full bg-purple-500"
              style={{ 
                height: `${scrollProgress}%`,
                transition: "height 0.2s ease"
              }}
            />
          </motion.div>

          <motion.div className="flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-semibold">Documentation</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </motion.button>
          </motion.div>

          <motion.ul className="mt-4 space-y-2 relative">
            {sections.map(({ id, title, ref }) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(ref, id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
                    ${activeSection === id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-800 lg:bg-gray-200 hover:bg-gray-700 lg:hover:bg-gray-300'
                    }`}
                >
                  {title}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-8 bg-gray-200 shadow-xl rounded-lg ml-4"
      >
        <section ref={introRef} className="mb-16">
          <motion.h1 className="text-3xl font-bold mb-4 text-gray-900">
            EventVerse API Documentation
          </motion.h1>
          <p className="text-gray-700 leading-relaxed">
            This documentation covers both frontend and backend APIs of the EventVerse platform. 
            The API provides endpoints for event management, RSVP handling, and email notifications.
          </p>
        </section>

        <section ref={backendRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Backend Setup
          </motion.h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Environment Configuration</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>SMTP Server: smtp.gmail.com</li>
                <li>SMTP Port: 587</li>
                <li>Firebase URL: firebase-url</li>
              </ul>
            </div>
          </div>
        </section>

        <section ref={modelsRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Data Models
          </motion.h2>
          <CodeBlock code={modelCode} title="Pydantic Models" />
        </section>

        <section ref={emailRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Email Service
          </motion.h2>
          <EndpointCard 
            method="GET"
            endpoint="/test-email/"
            description="Test the email service functionality"
            requestBody={{ "email": "user@example.com" }}
            response={{ "status": "success", "message": "Test email sent successfully" }}
          />
        </section>

        <section ref={eventsRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Event Endpoints
          </motion.h2>
          <div className="space-y-6">
            <EndpointCard 
              method="POST"
              endpoint="/events/"
              description="Create a new event"
              requestBody={{
                "eventName": "string",
                "eventDescription": "string",
                "eventDate": "ISO 8601 string",
                "eventLocation": "string",
                "eventHostId": "string",
                "eventHostApiKey": "string"
              }}
              response={{
                "eventId": "123456",
                "message": "Event created successfully"
              }}
            />
            <CodeBlock code={createEventCode} title="Create Event Implementation" />
          </div>
        </section>

        <section ref={rsvpRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            RSVP Endpoints
          </motion.h2>
          <div className="space-y-6">
            <EndpointCard 
              method="POST"
              endpoint="/api/rsvp"
              description="Submit an RSVP for an event"
              requestBody={{
                "event_id": "string",
                "name": "string",
                "email": "string",
                "response": "string"
              }}
              response={{
                "status": "success",
                "message": "RSVP submitted and confirmation email sent",
                "emailSent": true
              }}
            />
            <CodeBlock code={rsvpCode} title="RSVP Endpoint Implementation" />
          </div>
        </section>

        <section ref={utilityRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Utility Functions
          </motion.h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Available Utilities</h3>
              <ul className="space-y-4">
                <li>
                  <h4 className="font-medium">generate_unique_event_id()</h4>
                  <p className="text-gray-600 mt-1">Generates a unique identifier for new events</p>
                </li>
                <li>
                  <h4 className="font-medium">validate_api_key(api_key: str)</h4>
                  <p className="text-gray-600 mt-1">Validates the provided API key against stored credentials</p>
                </li>
                <li>
                  <h4 className="font-medium">format_datetime(date_string: str)</h4>
                  <p className="text-gray-600 mt-1">Formats ISO 8601 datetime strings into human-readable format</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-4 right-4 lg:hidden bg-purple-500 text-white p-3 rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default Documentation;