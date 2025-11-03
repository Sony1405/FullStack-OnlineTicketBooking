import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSegment, setSelectedSegment] = useState(""); // Category
  const [selectedPrice, setSelectedPrice] = useState(""); // Free/Paid
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Language
  const [venues, setVenues] = useState([]); // List of venues
  const [selectedVenue, setSelectedVenue] = useState(""); // Selected venue

  const API_KEY = "GXip7siabADLEJ3vHcCIQeTYPcyQGSfq";

  const navigate = useNavigate();
  // Ticketmaster segments
  const segments = [
    { name: "Music", id: "KZFzniwnSyZfZ7v7nJ" },
    { name: "Sports", id: "KZFzniwnSyZfZ7v7nE" },
    { name: "Arts & Theatre", id: "KZFzniwnSyZfZ7v7na" },
    { name: "Film", id: "KZFzniwnSyZfZ7v7nn" },
    { name: "Family", id: "KZFzniwnSyZfZ7v7nI" },
    { name: "Miscellaneous", id: "KZFzniwnSyZfZ7v7n1" },
  ];

  const languages = [
    { name: "English (US)", code: "en-us" },
    { name: "Spanish (MX)", code: "es-us" },
    { name: "French (FR)", code: "fr-fr" },
  ];

  // Fetch events based on selected filters
  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=16`;

      if (selectedSegment) url += `&segmentId=${selectedSegment}`;
      if (selectedPrice === "Free") url += `&priceMin=0&priceMax=0`;
      if (selectedVenue) url += `&venueId=${selectedVenue}`;

      // Map language to country for actual filtering
      if (selectedLanguage === "en-us") url += "&countryCode=US";
      if (selectedLanguage === "es-us") url += "&countryCode=MX";
      if (selectedLanguage === "fr-fr") url += "&countryCode=FR";

      const response = await axios.get(url);
      const eventData = response.data._embedded?.events || [];
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available venues (first 20)
  const fetchVenues = async () => {
    try {
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${API_KEY}&size=20`
      );
      setVenues(response.data._embedded?.venues || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues([]);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedSegment, selectedPrice, selectedLanguage, selectedVenue]);

  return (
    <div className="container-fluid bg-light py-4">
      <div className="row" style={{ margin: "20px 200px" }}>
        {/* Filters Section */}
        <div
          className="col-md-3 col-lg-2 px-4 mb-4"
          style={{
            height: "auto",
            marginTop: "100px",
          }}
        >
          <h4 className="fw-bold mb-3">Filters</h4>

          {/* Language Filter */}
          <div className="mb-3">
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Regions (Language)</Accordion.Header>
                <Accordion.Body className="d-flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={
                        selectedLanguage === lang.code
                          ? "danger"
                          : "outline-secondary"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedLanguage(
                          selectedLanguage === lang.code ? "" : lang.code
                        )
                      }
                    >
                      {lang.name}
                    </Button>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Categories Accordion */}
          <div className="mb-3">
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Categories</Accordion.Header>
                <Accordion.Body className="d-flex flex-wrap gap-2">
                  {segments.map((segment) => (
                    <Button
                      key={segment.id}
                      variant={
                        selectedSegment === segment.id
                          ? "danger"
                          : "outline-secondary"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedSegment(
                          selectedSegment === segment.id ? "" : segment.id
                        )
                      }
                    >
                      {segment.name}
                    </Button>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Price Filter */}
          <div className="mb-3">
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Price</Accordion.Header>
                <Accordion.Body className="d-flex flex-wrap gap-2">
                  {["Free", "Paid"].map((price) => (
                    <Button
                      key={price}
                      variant={
                        selectedPrice === price
                          ? "danger"
                          : "outline-secondary"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedPrice(
                          selectedPrice === price ? "" : price
                        )
                      }
                    >
                      {price}
                    </Button>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Browse by Venues Accordion */}
          <div className="mb-3">
            <Accordion defaultActiveKey="">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Browse by Venues</Accordion.Header>
                <Accordion.Body className="d-flex flex-wrap gap-2">
                  {venues.map((venue) => (
                    <Button
                      key={venue.id}
                      variant={
                        selectedVenue === venue.id
                          ? "danger"
                          : "outline-secondary"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedVenue(
                          selectedVenue === venue.id ? "" : venue.id
                        )
                      }
                    >
                      {venue.name}
                    </Button>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>

        {/* Events Section */}
        <div className="col-md-9 col-lg-10" style={{ marginTop: "15px" }}>
          {/* Segment Buttons Above Cards */}
          <div
            className="mb-3 d-flex flex-wrap gap-2"
            style={{ marginLeft: "300px", marginBottom: "30px" }}
          >
            {segments.map((segment) => (
              <Button
                key={segment.id}
                variant={
                  selectedSegment === segment.id
                    ? "danger"
                    : "outline-secondary"
                }
                size="sm"
                onClick={() =>
                  setSelectedSegment(
                    selectedSegment === segment.id ? "" : segment.id
                  )
                }
              >
                {segment.name}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-2">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="row g-4">
              {events.map((event) => (
                <div className="col-sm-6 col-md-4 col-lg-3" key={event.id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Img
                      variant="top"
                      src={
                        event.images?.[0]?.url ||
                        "https://via.placeholder.com/300x200"
                      }
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fs-6 fw-bold">
                        {event.name}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        {event.dates?.start?.localDate
                          ? new Date(
                              event.dates.start.localDate
                            ).toDateString()
                          : "Date not available"}
                      </Card.Text>
                      <Card.Text className="text-secondary small">
                        {event._embedded?.venues?.[0]?.name ||
                          "Venue not available"}
                      </Card.Text>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">
              No events found for selected filters.
            </p>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default EventsPage;
