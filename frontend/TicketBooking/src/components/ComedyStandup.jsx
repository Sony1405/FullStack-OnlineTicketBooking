import React, { useState, useEffect } from "react";
import { Card, Container, Spinner, Badge } from "react-bootstrap";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ComedyStandup = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ for navigation
  const API_KEY = "GXip7siabADLEJ3vHcCIQeTYPcyQGSfq";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json`,
          {
            params: {
              apikey: API_KEY,
              classificationName: "Comedy",
              size: 50,
            },
          }
        );

        if (res.data._embedded) {
          const rawEvents = res.data._embedded.events;

          // ✅ Remove duplicates by name + date + venue
          const uniqueEvents = [
            ...new Map(
              rawEvents.map((event) => {
                const key = `${event.name}-${event.dates?.start?.localDate}-${event._embedded?.venues?.[0]?.name}`;
                return [key, event];
              })
            ).values(),
          ];

          setEvents(uniqueEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error(err);
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
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(3, events.length) } },
      { breakpoint: 992, settings: { slidesToShow: Math.min(2, events.length) } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container className="text-center my-5">
        <h5>No Comedy / Stand-up events found.</h5>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h3 className="mb-4 fw-bold">🎭 Comedy / Stand-up</h3>
      <Slider {...settings}>
        {events.map((event) => {
          const isPromoted = event.promoter && event.promoter.name;
          return (
            <div key={event.id} style={{ padding: "0 10px" }}>
              <Card
                onClick={() => navigate(`/event/${event.id}`)} // ✅ navigate to event details
                style={{
                  height: "350px",
                  minWidth: "250px",
                  position: "relative",
                  margin: "0 8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: "none",
                  borderRadius: "10px",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
                className="hover-card"
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {isPromoted && (
                  <Badge
                    bg="danger"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 2,
                    }}
                  >
                    PROMOTED
                  </Badge>
                )}

                <div
                  style={{
                    height: "200px",
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      event.images?.[0]?.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      color: "white",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatDate(event.dates?.start?.localDate)}
                  </div>
                </div>

                <Card.Body>
                  <Card.Title
                    className="fw-bold text-truncate"
                    title={event.name}
                    style={{ minHeight: "50px" }}
                  >
                    {event.name}
                  </Card.Title>
                  <Card.Text className="text-muted" style={{ minHeight: "40px" }}>
                    {event._embedded?.venues?.[0]?.name || "Venue TBA"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </Slider>
    </Container>
  );
};

export default ComedyStandup;
