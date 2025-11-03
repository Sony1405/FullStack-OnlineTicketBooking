import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./BookingPage.css";
import axios from "axios";
import { toast } from "react-toastify";

const BookingOverlayPage = () => {
  const { movieId } = useParams();
  const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);

  const navigate = useNavigate();

  const seatLayout = [
    ["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12"],
    ["B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12"],
    ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12"],
    ["D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12"],
    ["E1","E2","E3","E4","E5","E6","E7","E8","E9","E10","E11","E12"],
    ["F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"],
    ["G1","G2","G3","G4","G5","G6","G7","G8","G9","G10","G11","G12"],
    ["H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12"],
    ["I1","I2","I3","I4","I5","I6","I7","I8","I9","I10","I11","I12"],
    ["J1","J2","J3","J4","J5","J6","J7","J8","J9","J10","J11","J12"],
    ["K1","K2","K3","K4","K5","K6","K7","K8","K9","K10","K11","K12"],
    ["L1","L2","L3","L4","L5","L6","L7","L8","L9","L10","L11","L12"]
  ];

  const showTimes = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM", "10:00 PM"];

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      setMovie(data);

      const price = Math.floor(Math.random() * 250) + 150;
      setTicketPrice(price);

      const trailerRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const trailerData = await trailerRes.json();
      const officialTrailer = trailerData.results.find((v) => v.type === "Trailer");
      if (officialTrailer) setTrailerKey(officialTrailer.key);
    };
    fetchMovie();

    // Fetch Theatres from backend
    const fetchTheatres = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/theatres");
        setTheatres(res.data);
      } catch (err) {
        console.error("Error fetching theatres:", err);
      }
    };
    fetchTheatres();
  }, [movieId]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getTierByRow = (rowIndex) => {
    if (rowIndex <= 1) return "Premium";
    if (rowIndex <= 4) return "Standard";
    return "Economy";
  };

  const getSeatPrice = (tier) => {
    switch (tier) {
      case "Premium": return Math.floor(ticketPrice * 1.5);
      case "Standard": return Math.floor(ticketPrice * 1.2);
      default: return ticketPrice;
    }
  };

  const getNextDates = () => {
    const today = new Date();
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-GB", options);
  };

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const rowIndex = seatLayout.findIndex(row => row.includes(seatId));
    const tier = getTierByRow(rowIndex);
    return sum + getSeatPrice(tier);
  }, 0);

  if (!movie) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;

  // ✅ Updated: Redirect to PaymentPage instead of direct backend post
  const handleConfirmBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login to confirm booking!");
      return;
    }

    const bookingData = {
      userId: user.id,
      movieId: movie.id,
      movieTitle: movie.title,
      theatreName: selectedTheatre?.name,
      location: selectedTheatre?.location,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats.join(","),
      totalAmount: totalPrice,
      posterPath: movie.poster_path, // ✅ NEW
    };

    // 👉 Navigate to Payment Page instead of posting directly
   navigate("/payment", {
  state: {
    bookingData,
    backdrop: movie.backdrop_path || movie.poster_path,
    trailerKey: trailerKey,
  },
});
  };

  const handleNotify = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/notifications/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          movieId: movie.id,
          movieTitle: movie.title
        }),
      });

      if (response.ok) {
        alert(`✅ You will be notified at ${userEmail} when ${movie.title} releases!`);
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Server not reachable.");
    }
  };

  return (
    <div className="overlay-booking-page">
      {trailerKey ? (
        <iframe
          className="trailer-bg"
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}`}
          title="Trailer Background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className="poster-bg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1
          }}
        ></div>
      )}

      <div className="overlay"></div>

      <div className="booking-panel">
        <h2>{movie.title}</h2>
        <div className="step-title">Step {step} of 5</div>

        {/* Step 1 - Select Theatre */}
        {step === 1 && (
          <div className="step-content">
            <h4>Select Theatre</h4>
            <div className="theatre-list">
              {theatres.map((theatre) => (
                <div
                  key={theatre.id}
                  className={`theatre-card ${selectedTheatre?.id === theatre.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedTheatre(theatre);
                    setTicketPrice(theatre.ticketPrice);
                    setStep(2);
                  }}
                >
                  <h5>{theatre.name}</h5>
                  <p>{theatre.location}</p>
                  <p>🎟 ₹{theatre.ticketPrice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 - Date */}
        {step === 2 && (
          <div className="step-content">
            <h4>Select Date</h4>
            <div className="date-selector">
              {getNextDates().map((date, idx) => {
                const dateKey = date.toISOString().split("T")[0];
                return (
                  <div
                    key={idx}
                    className={`date-card ${selectedDate === dateKey ? "active" : ""}`}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setStep(3);
                    }}
                  >
                    <div className="day">{date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}</div>
                    <div className="date">{date.getDate()}</div>
                    <div className="month">{date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3">
              <Button onClick={() => setStep(1)} variant="light">Back</Button>
            </div>
          </div>
        )}

        {/* Step 3 - Time */}
        {step === 3 && (
          <div className="step-content">
            <h4>Select Time</h4>
            <div className="d-flex flex-wrap gap-2">
              {showTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "warning" : "secondary"}
                  onClick={() => {
                    setSelectedTime(time);
                    setStep(4);
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="mt-3">
              <Button onClick={() => setStep(2)} variant="light">Back</Button>
            </div>
          </div>
        )}

        {/* Step 4 - Seats */}
        {step === 4 && (
          <div className="step-content">
            <h4>Select Seats</h4>
            <div className="seat-tier">
              {seatLayout.map((row, rowIndex) => {
                const tier = getTierByRow(rowIndex);
                return (
                  <div className="seat-row" key={rowIndex}>
                    {row.map((seat, index) => (
                      <div
                        key={index}
                        className={`seat ${tier} ${selectedSeats.includes(seat) ? "selected" : "available"}`}
                        onClick={() => toggleSeat(seat)}
                      >
                        <div className="seat-id">{seat}</div>
                        <div className="seat-price">₹{getSeatPrice(tier)}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 d-flex justify-content-between">
              <Button onClick={() => setStep(3)} variant="light">Back</Button>
              <Button
                onClick={() => setStep(5)}
                variant="success"
                disabled={selectedSeats.length === 0}
              >
                Next / Summary
              </Button>
            </div>
          </div>
        )}

        {/* Step 5 - Summary */}
        {step === 5 && (
          <div className="step-content d-flex flex-column align-items-center justify-content-center text-center">
            <h4>Booking Summary</h4>
            <p><strong>Theatre:</strong> {selectedTheatre?.name || "None"}</p>
            <p><strong>Location:</strong> {selectedTheatre?.location || "None"}</p>
            <p><strong>Date:</strong> {selectedDate ? formatDate(selectedDate) : "None"}</p>
            <p><strong>Time:</strong> {selectedTime || "None"}</p>
            <p><strong>Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
            <p><strong>Total Price:</strong> ₹{totalPrice}</p>
            <div className="mt-3 d-flex gap-2">
              <Button onClick={() => setStep(4)} variant="light">Back</Button>

              {selectedSeats.length > 0 ? (
                <Button
                  variant="success"
                  onClick={handleConfirmBooking}
                  disabled={selectedSeats.length === 0}
                >
                  🎟 Confirm Booking (₹{totalPrice})
                </Button>
              ) : (
                <button onClick={handleNotify}>🔔 Notify Me</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingOverlayPage;
