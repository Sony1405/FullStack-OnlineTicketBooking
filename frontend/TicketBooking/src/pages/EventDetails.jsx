import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Button, Card, Carousel } from "react-bootstrap";
import EventBookingModal from "./EventBookingModal"; // ✅ added import

const API_KEY = "GXip7siabADLEJ3vHcCIQeTYPcyQGSfq";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [showBooking, setShowBooking] = useState(false); // ✅ added state for modal

  // 🔹 Show sticky header on scroll
  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Fetch event details
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${API_KEY}`
      );

      console.log("Fetched Event Details:", response.data);
      setEvent(response.data);

      // Fetch recommendations
      const genre = response.data.classifications?.[0]?.genre?.name;
      const city = response.data._embedded?.venues?.[0]?.city?.name;
      const recResponse = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&classificationName=${
          genre || "music"
        }&city=${city || "Delhi"}&size=20`
      );
      setRecommended(recResponse.data._embedded?.events || []);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEvent(null);
    setRecommended([]);
    fetchEventDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading || !event) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-2">Loading event details...</p>
      </div>
    );
  }

  const venue = event._embedded?.venues?.[0];
  const image = event.images?.[0]?.url || "https://via.placeholder.com/400x300";

  const chunkEvents = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };
  const eventChunks = chunkEvents(recommended, 4);
  

  return (
    <div className="container my-5 position-relative">
      {/* 🔹 Sticky Header */}
      {showHeader && (
        <div
          className="position-fixed top-0 start-0 w-100 bg-white shadow-sm py-2 px-4 d-flex justify-content-between align-items-center"
          style={{ zIndex: 1050 }}
        >
          <h4 className="m-0 fw-bold text-dark text-truncate" style={{ maxWidth: "70%" }}>
            {event.name}
          </h4>
          <Button
            variant="danger"
            className="fw-semibold px-4 rounded-pill"
            onClick={() => {
              console.log("🎟️ Book Now clicked | event:", event);
              setShowBooking(true); // ✅ open modal
            }}
          >
            🎟️ Book Now
          </Button>
        </div>
      )}

      {/* 🔹 Main Event Info Section */}
      <div className="d-flex flex-column flex-md-row align-items-start gap-4 my-4">
        <div className="flex-shrink-0" style={{ flexBasis: "50%" }}>
          <img
            src={image}
            alt={event.name}
            className="img-fluid rounded shadow-sm"
            style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }}
          />
        </div>

        <div className="flex-grow-1 d-flex justify-content-center" style={{ flexBasis: "50%" }}>
          <Card className="border-0 shadow-lg rounded-4 p-4 bg-light" style={{ width: "80%" }}>
            <Card.Body>
              <h3 className="fw-bold mb-3 text-dark">{event.name}</h3>
              <hr className="text-muted" />

              <div className="mb-3">
                <p className="mb-2">
                  <i className="bi bi-calendar-event text-danger me-2"></i>
                  <strong>Date:</strong>{" "}
                  {event.dates?.start?.localDate
                    ? new Date(event.dates.start.localDate).toDateString()
                    : "N/A"}
                </p>
                <p className="mb-2">
                  <i className="bi bi-clock text-danger me-2"></i>
                  <strong>Time:</strong> {event.dates?.start?.localTime || "N/A"}
                </p>
                <p className="mb-2">
                  <i className="bi bi-music-note-beamed text-danger me-2"></i>
                  <strong>Genre:</strong>{" "}
                  {event.classifications?.[0]?.genre?.name || "N/A"}
                </p>
                <p className="mb-2">
                  <i className="bi bi-geo-alt text-danger me-2"></i>
                  <strong>Venue:</strong> {venue?.name || "N/A"},{" "}
                  {venue?.city?.name || "N/A"}
                </p>
              </div>

              {venue?.address?.line1 && (
                <p className="text-muted small mb-4">
                  <i className="bi bi-map text-danger me-2"></i>
                  {venue.address.line1}
                </p>
              )}

              <div className="d-flex gap-3 mt-4">
                {/* ✅ Fixed Book Now button */}
                <Button
                  variant="danger"
                  className="fw-semibold px-4 rounded-pill"
                  onClick={() => {
                    console.log("🎟️ Book Now clicked | event:", event);
                    setShowBooking(true); // ✅ open modal
                  }}
                >
                  🎟️ Book Now
                </Button>

                {venue && (
                  <Button
                    variant="outline-danger"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${venue.name || ""} ${venue.city?.name || ""}`
                    )}`}
                    target="_blank"
                    className="fw-semibold px-4 rounded-pill"
                  >
                    📍 View Venue
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 🔹 About the Event */}
      {event.info && (
        <div className="mt-5">
          <h4>About The Event</h4>
          <p className="text-secondary">{event.info}</p>
        </div>
      )}

      {/* 🔹 Artists Section */}
      {event._embedded?.attractions && (
        <div className="mt-5">
          <h4 className="mb-3">Artists</h4>
          <div className="d-flex flex-wrap gap-4">
            {event._embedded.attractions.map((artist) => (
              <Card
                key={artist.id}
                style={{ width: "150px" }}
                className="border-0 text-center"
              >
                <Card.Img
                  variant="top"
                  src={
                    artist.images?.[0]?.url ||
                    "https://via.placeholder.com/150x150"
                  }
                  className="rounded shadow-sm"
                />
                <Card.Body>
                  <Card.Title className="fs-6">{artist.name}</Card.Title>
                  <small className="text-muted">
                    {artist.classifications?.[0]?.segment?.name || "Performer"}
                  </small>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Recommendations Carousel */}
      {recommended.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">You May Also Like</h4>
          <Carousel indicators={false} interval={4000} pause="hover">
            {eventChunks.map((group, i) => (
              <Carousel.Item key={i}>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  {group.map((rec) => (
                    <Card
                      key={rec.id}
                      style={{ width: "200px" }}
                      className="border-0 shadow-sm"
                    >
                      <Card.Img
                        variant="top"
                        src={
                          rec.images?.[0]?.url ||
                          "https://via.placeholder.com/200x250"
                        }
                        className="rounded-top"
                      />
                      <Card.Body>
                        <Card.Title className="fs-6">{rec.name}</Card.Title>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/event/${rec.id}`);
                          }}
                        >
                          View
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      )}

      {/* ✅ Booking Modal */}
      <EventBookingModal
        show={showBooking}
        onHide={() => setShowBooking(false)}
        event={event}
      />
    </div>
  );
};

export default EventDetails;
