import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import Slider from "react-slick";
import { FiShare2 } from "react-icons/fi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./StreamDetails.css";

const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

const StreamDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [step, setStep] = useState("gateway"); // "gateway" | "success"

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsRes = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}`,
          { params: { api_key: TMDB_API_KEY, language: "en-US" } }
        );
        setDetails(detailsRes.data);

        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}/credits`,
          { params: { api_key: TMDB_API_KEY, language: "en-US" } }
        );

        const validCast = creditsRes.data.cast
          .filter((p) => p.profile_path)
          .slice(0, 10);
        const validCrew = creditsRes.data.crew
          .filter((p) => p.profile_path)
          .slice(0, 10);

        setCast(validCast);
        setCrew(validCrew);

        let latestRes;
        if (type === "movie") {
          latestRes = await axios.get(
            `https://api.themoviedb.org/3/movie/now_playing`,
            { params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 } }
          );
          latestRes.data.results.sort(
            (a, b) => new Date(b.release_date) - new Date(a.release_date)
          );
        } else {
          latestRes = await axios.get(
            `https://api.themoviedb.org/3/tv/on_the_air`,
            { params: { api_key: TMDB_API_KEY, language: "en-US", page: 1 } }
          );
          latestRes.data.results.sort(
            (a, b) => new Date(b.first_air_date) - new Date(a.first_air_date)
          );
        }
        setLatest(latestRes.data.results.slice(0, 15));
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 300;
      setShowStickyHeader(show);
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.display = show ? "none" : "flex";
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  // Open Payment Gateway
  const handleOpenPayment = (type) => {
    setPaymentType(type);
    setShowPaymentModal(true);
    setStep("gateway");
  };

  const handlePayNow = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        setShowPaymentModal(false);
      }, 2000);
    }, 1500);
  };

  if (loading || !details) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 text-light">
        <Spinner animation="border" />
        <span className="ms-3">Loading...</span>
      </div>
    );
  }

  return (
    <div className="stream-page">
      {/* Sticky Header */}
      <div className={`sticky-header1 ${showStickyHeader ? "show" : ""}`}>
        <div className="sticky-left">
          <h5 className="sticky-title">{details.name || details.title}</h5>
        </div>
        <div className="sticky-right">
          <button className="rent-btn" onClick={() => handleOpenPayment("Rent")}>
            Rent ₹89
          </button>
          <button className="buy-btn" onClick={() => handleOpenPayment("Buy")}>
            Buy ₹179
          </button>
        </div>
      </div>

      <Container fluid className="stream-details-container">
        <div
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(
              to right,
              rgba(0,0,0,0.85) 20%,
              rgba(0,0,0,0.65) 60%,
              rgba(0,0,0,0.85) 100%
            ), url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Row className="align-items-center py-5 px-3">
            <Col md={4} className="poster-col">
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={details.name || details.title}
                className="poster-image"
              />
            </Col>
            <Col md={8} className="details-col text-light position-relative">
              <h1 className="title">{details.name || details.title}</h1>
              <p className="meta">
                {(details.first_air_date || details.release_date)?.slice(0, 4)} •{" "}
                {details.genres.map((g) => g.name).join(", ")} •{" "}
                {details.vote_average.toFixed(1)}⭐
              </p>
              <p className="overview">{details.overview}</p>

              {/* Share Button */}
              <div
                className="share-icon"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        title: details.title || details.name,
                        text: details.overview,
                        url: window.location.href,
                      })
                    : alert("Share not supported on this browser")
                }
              >
                <FiShare2 size={28} />
              </div>

              <div className="button-group">
                <button
                  className="rent-btn"
                  onClick={() => handleOpenPayment("Rent")}
                >
                  Rent ₹89
                </button>
                <button
                  className="buy-btn"
                  onClick={() => handleOpenPayment("Buy")}
                >
                  Buy ₹179
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Payment Modal */}
        <Modal
          show={showPaymentModal}
          onHide={() => setShowPaymentModal(false)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className="payment-modal-body text-center">
            {step === "gateway" && (
              <div className="payment-gateway">
                <h4>💰 Payment Gateway</h4>
                <p>Please select your preferred payment method</p>

                <div className="payment-options">
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="UPI"
                      checked={selectedMethod === "UPI"}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />{" "}
                    UPI
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="Card"
                      checked={selectedMethod === "Card"}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />{" "}
                    Credit / Debit Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="NetBanking"
                      checked={selectedMethod === "NetBanking"}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    />{" "}
                    Net Banking
                  </label>
                </div>

                <Button className="pay-btn" onClick={handlePayNow}>
                  Pay Now {paymentType === "Rent" ? "₹89" : "₹179"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-2"
                >
                  Back
                </Button>
              </div>
            )}

            {step === "processing" && (
              <div className="processing">
                <Spinner animation="border" variant="success" />
                <p className="mt-3">Processing your payment...</p>
              </div>
            )}

            {step === "success" && (
              <div className="payment-success text-center">
                <div className="success-check">✅</div>
                <h4>Payment Successful!</h4>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Cast Section */}
        {cast.length > 0 && (
          <div className="cast-section">
            <h2>Cast</h2>
            <Slider {...sliderSettings}>
              {cast.map((person) => (
                <div key={person.id} className="cast-card text-center px-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                    alt={person.name}
                    className="cast-img"
                  />
                  <p className="cast-name">{person.name}</p>
                  <p className="cast-role">{person.character}</p>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Crew Section */}
        {crew.length > 0 && (
          <div className="crew-section">
            <h2>Crew</h2>
            <Slider {...sliderSettings}>
              {crew.map((member) => (
                <div key={member.id} className="cast-card text-center px-2">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                    alt={member.name}
                    className="cast-img"
                  />
                  <p className="cast-name">{member.name}</p>
                  <p className="cast-role">{member.job}</p>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Similar Section */}
        {latest.length > 0 && (
          <div className="similar-section">
            <h2>You might also like</h2>
            <Slider {...sliderSettings}>
              {latest
                .filter((item) => item.poster_path)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={`/stream/${item.media_type || type}/${item.id}`}
                    className="similar-card"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.name || item.title}
                      className="similar-img"
                    />
                    <p className="similar-title">{item.name || item.title}</p>
                  </Link>
                ))}
            </Slider>
          </div>
        )}
      </Container>
    </div>
  );
};

export default StreamDetails;
