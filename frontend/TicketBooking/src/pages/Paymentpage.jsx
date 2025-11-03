import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, backdrop, trailerKey, type } = location.state || {}; // ✅ added type
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const playBeep = () => {
    const beep = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_5c8b1d3e0c.mp3?filename=interface-124464.mp3"
    );
    beep.play().catch(() => {});
  };

  const handlePayment = async () => {
    if (!bookingData) {
      toast.error("No booking details found!");
      return;
    }

    setLoading(true);
    toast.info("Processing Payment... 💳");

    setTimeout(async () => {
      playBeep();
      setSuccess(true);
      toast.success("Payment Successful! 🎉");

      try {
        // ✅ Choose correct API for movie/event
        const apiUrl =
          type === "event"
            ? "http://localhost:8082/api/event-bookings/add"
            : "http://localhost:8082/api/bookings/add";

        await axios.post(apiUrl, bookingData);
        toast.success("🎟 Booking Confirmed Successfully!");

        window.dispatchEvent(new Event("notificationAdded"));

        setTimeout(() => navigate("/my-bookings"), 2500);
      } catch (err) {
        console.error(err);
        toast.error("Failed to confirm booking. Try again!");
      } finally {
        setLoading(false);
      }
    }, 2500);
  };

  return (
    <div className="payment-page">
      {/* 🎥 Background */}
      {trailerKey ? (
        <>
          <iframe
            className="trailer-bg"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
          <div className="video-overlay"></div>
        </>
      ) : type === "event" ? ( // ✅ fixed check
        <div
          className="poster-bg"
          style={{
            backgroundImage: `url(${
              bookingData?.image ||
              bookingData?.poster ||
              "https://via.placeholder.com/1200x700?text=Event+Poster"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.6)",
          }}
        ></div>
      ) : (
        <div
          className="poster-bg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(3px) brightness(0.6)",
          }}
        ></div>
      )}

      <div className="overlay"></div>

      <Card className="payment-card">
        {!success ? (
          <>
            <h3 className="text">💰 Payment Gateway</h3>
            <p className="text">Please select your preferred payment method</p>

            <div className="payment-options">
              <label>
                <input type="radio" name="payment" defaultChecked /> UPI
              </label>
              <label>
                <input type="radio" name="payment" /> Credit / Debit Card
              </label>
              <label>
                <input type="radio" name="payment" /> Net Banking
              </label>
            </div>

            {loading ? (
              <div className="payment-loader">
                <div className="card-spinner"></div>
                <p>Processing Payment...</p>
              </div>
            ) : (
              <>
                <Button
                  onClick={handlePayment}
                  variant="success"
                  className="pay-now-btn mt-3"
                >
                  Pay Now ₹{bookingData?.totalAmount || 0}
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  variant="secondary"
                  className="mt-2"
                >
                  Back
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="success-animation">
            <div className="checkmark">
              <div className="checkmark-circle">
                <span className="checkmark-symbol">✔</span>
              </div>
            </div>

            <h3>Payment Successful! 🎉</h3>
            <p>Redirecting to My Bookings...</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentPage;
