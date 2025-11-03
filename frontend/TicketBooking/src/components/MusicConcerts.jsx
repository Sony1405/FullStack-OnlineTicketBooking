import React, { useState, useEffect } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MusicConcerts = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ for navigation

  const API_KEY = "GXip7siabADLEJ3vHcCIQeTYPcyQGSfq";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&classificationName=music&size=50`
        );
        const data = await res.json();

        if (data._embedded && data._embedded.events) {
          // 🗝️ Keep only earliest event per name
          const eventsMap = new Map();
          data._embedded.events.forEach((event) => {
            const key = event.name.toLowerCase();
            const currentDate = event.dates?.start?.localDate || "9999-12-31";
            if (
              !eventsMap.has(key) ||
              currentDate < eventsMap.get(key).dates.start.localDate
            ) {
              eventsMap.set(key, event);
            }
          });

          const uniqueEvents = Array.from(eventsMap.values());
          setEvents(uniqueEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const settings = {
    dots: false,
    infinite: events.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, events.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, events.length) } },
      { breakpoint: 992, settings: { slidesToShow: Math.min(2, events.length) } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <h3 className="mb-4 fw-bold">🎵 Music / Concerts</h3>
      {events.length > 0 ? (
        <Slider {...settings}>
          {events.map((event) => (
            <div key={event.id} className="px-2">
              <Card
                className="shadow-sm rounded overflow-hidden"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/event/${event.id}`)} // ✅ opens EventDetails
              >
                <div style={{ position: "relative" }}>
                  <Card.Img
                    src={event.images?.[0]?.url}
                    alt={event.name}
                    style={{ height: "320px", objectFit: "cover" }}
                  />
                </div>
                <Card.Body>
                  <Card.Title
                    className="fw-bold text-truncate"
                    title={event.name}
                  >
                    {event.name}
                  </Card.Title>
                  <Card.Text className="text-muted">
                    Date:{" "}
                    {event.dates?.start?.localDate
                      ? new Date(event.dates.start.localDate).toDateString()
                      : "TBA"}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    Venue: {event._embedded?.venues?.[0]?.name || "TBA"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No music concerts found.</p>
      )}
    </Container>
  );
};

export default MusicConcerts;
