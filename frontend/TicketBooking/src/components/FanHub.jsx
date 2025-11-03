import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { FaMicrophone, FaMusic, FaStar, FaCamera } from "react-icons/fa";

const FanHub = () => {
  const [artists, setArtists] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "https://www.meraevents.com/developer/event/getEventList",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token: "QVu5r8LfGLvHnYacfAlP", // 🔑 use your real API key
              rows: 10,
              page: 1,
            }),
          }
        );

        const data = await res.json();
        console.log("API Response:", data);

        // ✅ adapt this based on actual JSON structure
        if (data && data.response) {
          setEvents(data.response);
          // fake "artists near you" list from events
          const mappedArtists = data.response.map((ev) => ({
            id: ev.EventId,
            name: ev.Title,
            image: ev.EventLogo || "https://via.placeholder.com/40",
            daysLeft: Math.floor(
              (new Date(ev.EndDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          }));
          setArtists(mappedArtists.slice(0, 3)); // take 3 artists
        }
      } catch (err) {
        console.error("MeraEvents API error:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Container className="py-4">
      {/* Title */}
      <h3 className="text-center mb-4">
        <FaMusic className="text-primary" /> Explore Artists & Live Moments
      </h3>

      <Row>
        {/* Artists Near You */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>
              <FaMicrophone className="text-secondary" /> Artists Near You
            </h5>
            {artists.length > 0 ? (
              artists.map((artist) => (
                <Row key={artist.id} className="align-items-center my-3">
                  <Col xs={2}>
                    <Image
                      src={artist.image}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                  </Col>
                  <Col>
                    <strong>{artist.name}</strong>
                    <div className="text-muted small">
                      {artist.daysLeft} days left
                    </div>
                  </Col>
                  <Col xs="auto">
                    <Button variant="primary" size="sm">
                      <FaStar className="me-1" /> Follow
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <p className="text-muted">Loading artists...</p>
            )}
          </Card>
        </Col>

        {/* Live Event Wall */}
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <h5>
              <FaCamera className="text-secondary" /> Live Event Wall
            </h5>
            <Row className="g-2 mt-2">
              {events.length > 0 ? (
                events.slice(0, 6).map((event) => (
                  <Col xs={6} key={event.EventId}>
                    <Image
                      src={event.EventLogo || "https://via.placeholder.com/150"}
                      thumbnail
                      className="rounded"
                    />
                  </Col>
                ))
              ) : (
                <p className="text-muted">Loading events...</p>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FanHub;
