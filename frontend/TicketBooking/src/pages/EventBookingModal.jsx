import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./EventBookingModal.css";
import axios from "axios";

const EventBookingModal = ({ show, onHide, event }) => {
  const [step, setStep] = useState(0);
  const [ticketType, setTicketType] = useState("Regular");
  const [quantity, setQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes] = useState([
    "10:00 AM",
    "1:30 PM",
    "4:00 PM",
    "7:00 PM",
    "9:30 PM",
  ]);

  const ticketPrices = { Regular: 499, VIP: 999 };
  const total = ticketPrices[ticketType] * quantity;
  const navigate = useNavigate();

  // Generate next 7 days dynamically
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const formatted = date.toISOString().split("T")[0];
      days.push({ date: formatted, label: `${dayName} ${formatted}` });
    }
    setAvailableDates(days);
    setSelectedDate(days[0]?.date || "");
  }, []);

  // Generate seat layout dynamically
  useEffect(() => {
    const rows = 6;
    const seatsPerRow = 10;
    const layout = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let s = 1; s <= seatsPerRow; s++) {
        row.push({
          id: `${String.fromCharCode(65 + r)}${s}`,
          booked: Math.random() < 0.1,
        });
      }
      layout.push(row);
    }
    setSeatLayout(layout);
  }, [event]);

  const handleSeatClick = (seat) => {
    if (seat.booked) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((s) => s !== seat.id)
        : prev.length < quantity
        ? [...prev, seat.id]
        : prev
    );
  };

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please sign in to book tickets.");
      onHide();
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time.");
      return;
    }

    if (selectedSeats.length !== quantity) {
      toast.error("Please select seats equal to ticket quantity.");
      return;
    }

    const bookingData = {
      userId: user.id,
      eventId: event.id,
      eventTitle: event.name,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats.join(", "),
      totalAmount: ticketPrices[ticketType] * quantity,
      image:
        event.image ||
        event.poster ||
        event.imageUrl ||
        event.images?.[0]?.url ||
        "https://via.placeholder.com/300x400?text=Event+Poster",
      seatType: ticketType, // ✅ FIXED (was selectedSeatType)
    };

    try {
      // ✅ Save to backend before moving to payment
      const response = await axios.post(
        "http://localhost:8082/api/event-bookings/add",
        bookingData
      );
      toast.success("Event booked successfully!");

      // ✅ Now navigate to payment with saved booking
      navigate("/payment", {
        state: {
          bookingData: response.data,
          backdrop: event.images?.[0]?.url || null,
          type: "event",
        },
      });

      onHide();
    } catch (error) {
      console.error("❌ Error saving event booking:", error);
      toast.error("Failed to save booking!");
    }
  };

  const steps = [
    {
      title: "Select Date",
      content: (
        <div className="date-selector">
          {availableDates.map((d) => (
            <Button
              key={d.date}
              variant={selectedDate === d.date ? "danger" : "outline-light"}
              size="sm"
              className="mx-1 my-1"
              onClick={() => setSelectedDate(d.date)}
            >
              {d.label}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "Select Time",
      content: (
        <div className="time-selector">
          {availableTimes.map((t) => (
            <Button
              key={t}
              variant={selectedTime === t ? "danger" : "outline-light"}
              size="sm"
              className="mx-1 my-1"
              onClick={() => setSelectedTime(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "Ticket Type & Quantity",
      content: (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Ticket Type</Form.Label>
            <Form.Select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
            >
              <option>Regular</option>
              <option>VIP</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-light"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="fw-bold fs-5">{quantity}</span>
              <Button
                variant="outline-light"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </Form.Group>
        </>
      ),
    },
    {
      title: "Select Seats",
      content: (
        <>
          <div className="seat-layout-modern">
            {seatLayout.map((row, idx) => (
              <div key={idx} className="seat-row">
                {row.map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat-modern ${
                      seat.booked
                        ? "booked"
                        : selectedSeats.includes(seat.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.id}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="legend-modern mt-3">
            <div><span className="seat-modern available"></span> Available</div>
            <div><span className="seat-modern selected"></span> Selected</div>
            <div><span className="seat-modern booked"></span> Booked</div>
          </div>
        </>
      ),
    },
    {
      title: "Confirm Booking",
      content: (
        <div className="text-center">
          <h5 className="text-light">🎟️ {event?.name}</h5>
          <p>{event?._embedded?.venues?.[0]?.name || "Unknown Venue"}</p>
          <p>
            📅 {selectedDate} | ⏰ {selectedTime}
          </p>
          <p>
            {quantity} x {ticketType} Tickets
          </p>
          <h4 className="text-danger fw-bold">Total: ₹{total}</h4>
        </div>
      ),
    },
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      className="blur-background"
    >
      <Modal.Header closeButton className="border-0 text-light modal-header-custom">
        <Modal.Title>{steps[step].title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-light">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4 }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-between">
        {step > 0 && (
          <Button variant="outline-light" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button variant="danger" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button variant="danger" onClick={handleConfirm}>
            Confirm Booking
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EventBookingModal;
