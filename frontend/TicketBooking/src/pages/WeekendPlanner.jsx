import React, { useState } from "react";
import { Button, Card, Badge, Modal } from "react-bootstrap";

const moodEvents = {
  Happy: [
    { name: "Comedy Show", time: "Evening", price: 500, img: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980", desc: "Laugh out loud with top comedians performing live!" },
    { name: "Karaoke Night", time: "Night", price: 400, img: "https://images.unsplash.com/photo-1506157786151-b8491531f063", desc: "Sing your heart out with friends and enjoy great vibes." },
  ],
  Chill: [
    { name: "Jazz Cafe Night", time: "Evening", price: 700, img: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1", desc: "Smooth jazz music with coffee and cozy ambiance." },
    { name: "Movie Screening", time: "Afternoon", price: 300, img: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc", desc: "Catch a classic movie screening in a comfy setup." },
  ],
  Excited: [
    { name: "EDM Concert", time: "Night", price: 1200, img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2", desc: "Get ready for an electrifying night of music and dance." },
    { name: "Stand-Up Comedy", time: "Evening", price: 600, img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d", desc: "Hilarious stand-up acts to make your weekend fun." },
  ],
  Romantic: [
    { name: "Candlelight Dinner Concert", time: "Night", price: 1500, img: "https://images.unsplash.com/photo-1521305916504-4a1121188589", desc: "Romantic candlelight dinner with live music." },
    { name: "Couple Movie Night", time: "Evening", price: 800, img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4", desc: "Enjoy a private movie night with your partner." },
  ],
  Adventurous: [
    { name: "Trekking Trip", time: "Morning", price: 1000, img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", desc: "Adventure awaits! A guided trek to beautiful trails." },
    { name: "Camping Night", time: "Night", price: 900, img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470", desc: "Spend a night under the stars with bonfire & fun." },
  ],
};

const WeekendPlanner = () => {
  const [mood, setMood] = useState(null);
  const [day, setDay] = useState("Saturday");
  const [budget, setBudget] = useState(1000);
  const [plan, setPlan] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const generatePlan = () => {
    if (!mood) return;
    const filtered = moodEvents[mood].filter((e) => e.price <= budget);
    setPlan(filtered);
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h3 className="text-center mb-4">🎭 Plan My Weekend – Mood Based Finder</h3>
        
        {/* Mood Selector Card */}
        <Card className="p-4 shadow-sm mb-4">
          <h5 className="mb-3">How are you feeling today?</h5>
          <div className="mb-3">
            {Object.keys(moodEvents).map((m) => (
              <Button
                key={m}
                variant={mood === m ? "primary" : "outline-primary"}
                className="me-2 mb-2"
                onClick={() => setMood(m)}
              >
                {m}
              </Button>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Which day are you free?</label>
            <select
              className="form-select"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Budget: <Badge bg="info">₹{budget}</Badge></label>
            <input
              type="range"
              className="form-range"
              min="200"
              max="2000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>

          <Button className="w-100" variant="success" onClick={generatePlan}>
            🚀 Generate My Plan
          </Button>
        </Card>

        {/* Generated Plan */}
        {plan.length > 0 && (
          <Card className="p-4 shadow-sm">
            <h5 className="mb-3">🎉 Your {day} Plan ({mood} Vibes)</h5>
            {plan.map((event, idx) => (
              <div key={idx} className="d-flex align-items-center mb-3 border-bottom pb-2">
                <img
                  src={event.img}
                  alt={event.name}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <strong>{event.name}</strong>
                  <div className="text-muted small">{event.time}</div>
                </div>
                <Badge bg="secondary" className="me-2">₹{event.price}</Badge>
                <Button size="sm" variant="warning" onClick={() => setSelectedEvent(event)}>
                  🎟️ Book Tickets
                </Button>
              </div>
            ))}
          </Card>
        )}

        {/* Event Details Modal */}
        <Modal show={!!selectedEvent} onHide={() => setSelectedEvent(null)} centered>
          {selectedEvent && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedEvent.name}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <img
                  src={selectedEvent.img}
                  alt={selectedEvent.name}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
                <p>{selectedEvent.desc}</p>
                <p>
                  <Badge bg="info">{selectedEvent.time}</Badge> &nbsp;
                  <Badge bg="success">₹{selectedEvent.price}</Badge>
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setSelectedEvent(null)}>Close</Button>
                <Button variant="primary">✅ Confirm Booking</Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default WeekendPlanner;
