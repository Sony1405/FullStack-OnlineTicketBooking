import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import QRCode from "react-qr-code";
import "./MyBookingPage.css";

const MyBookings = () => {
  const [movieBookings, setMovieBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // ✅ Fetch both APIs together to avoid overwriting issues
      const [movieRes, eventRes] = await Promise.all([
        axios.get("http://localhost:8082/api/bookings/all"),
        axios.get("http://localhost:8082/api/event-bookings/all"),
      ]);

      setMovieBookings(movieRes.data || []);
      setEventBookings(eventRes.data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleViewTicket = (booking, type) => {
    setSelectedBooking({ ...booking, type });
    setShowModal(true);
  };

  const getPoster = (booking, type) => {
    if (type === "movie") {
      if (booking.posterPath)
        return `https://image.tmdb.org/t/p/w500${booking.posterPath}`;
      if (booking.backdrop)
        return `https://image.tmdb.org/t/p/w500${booking.backdrop}`;
    } else if (type === "event") {
      if (booking.image && booking.image.startsWith("http")) return booking.image;
      if (booking.image)
        return `http://localhost:8082/uploads/${booking.image}`;
    }
    return "https://via.placeholder.com/300x400?text=No+Image";
  };

  return (
    <Container className="my-bookings-container mt-5">
      <h2 className="text-center mb-4">🎟 My Bookings</h2>

      <Row>
        {/* 🎬 Movie Bookings */}
        {movieBookings.map((booking, index) => (
          <Col md={8} className="mx-auto" key={`movie-${index}`}>
            <Card className="custom-booking-card shadow-sm">
              <div className="booking-content">
                <img
                  src={getPoster(booking, "movie")}
                  alt="Movie Poster"
                  className="booking-img"
                />

                <div className="booking-details">
                  <div className="booking-top">
                    <h5 className="booking-title">{booking.movieTitle}</h5>
                    <p className="booking-text">
                      {booking.language || "N/A"}, {booking.format || "2D"}
                    </p>
                    <p className="booking-text">
                      {booking.date} | {booking.time}
                    </p>
                    <p className="booking-text">{booking.theatreName}</p>
                    <p className="booking-text">
                      Seats: {booking.seats || "N/A"}
                    </p>
                    <p className="booking-text">
                      Price: ₹{booking.totalAmount || "N/A"}
                    </p>
                  </div>

                  <div className="booking-bottom">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleViewTicket(booking, "movie")}
                      className="view-ticket-btn"
                    >
                      View Ticket
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}

        {/* 🎤 Event Bookings */}
        {eventBookings.map((booking, index) => (
          <Col md={8} className="mx-auto" key={`event-${index}`}>
            <Card className="custom-booking-card shadow-sm">
              <div className="booking-content">
                <img
                  src={getPoster(booking, "event")}
                  alt="Event Poster"
                  className="booking-img"
                />

                <div className="booking-details">
                  <div className="booking-top">
                    <h5 className="booking-title">{booking.eventTitle}</h5>
                    <p className="booking-text">{booking.date}</p>
                    <p className="booking-text">{booking.time}</p>
                    <p className="booking-text">{booking.eventVenue}</p>
                    <p className="booking-text">
                      Seats: {booking.seats || "N/A"}
                    </p>
                    <p className="booking-text">
                      Ticket Type: {booking.seatType || "Regular"}
                    </p>
                    <p className="booking-text">
                      Price: ₹{booking.totalAmount || "N/A"}
                    </p>
                  </div>

                  <div className="booking-bottom">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleViewTicket(booking, "event")}
                      className="view-ticket-btn"
                    >
                      View Ticket
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 🎫 Ticket Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
        <div
          className={`ticket-modal ${
            selectedBooking?.type === "movie" ? "movie-ticket" : "event-ticket"
          }`}
        >
          <span className="close-icon" onClick={() => setShowModal(false)}>
            ✖
          </span>

          <h4 className="ticket-title">
            {selectedBooking?.movieTitle || selectedBooking?.eventName}
          </h4>

          <div className="ticket-body">
            <QRCode
              value={JSON.stringify({
                id: selectedBooking?.id,
                name: selectedBooking?.movieTitle || selectedBooking?.eventName,
                seats: selectedBooking?.seatNumbers,
              })}
              size={130}
            />
            <div className="ticket-details mt-3">
              <p>
                <strong>Booking ID:</strong> {selectedBooking?.id}
              </p>
              <p>
                <strong>Seats:</strong> {selectedBooking?.seats || "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {selectedBooking?.date || selectedBooking?.eventDate}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {selectedBooking?.time || selectedBooking?.eventTime}
              </p>
              
              <p>
                <strong>Price:</strong> ₹{selectedBooking?.totalAmount || "N/A"}
              </p>
            </div>
          </div>

          <div className="ticket-footer">
            <p>
              Thank you for booking with <strong><br />BookItNow 🎬</strong>
            </p>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default MyBookings;
