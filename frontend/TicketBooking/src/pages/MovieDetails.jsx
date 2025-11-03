import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./MovieDetails.css";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Modal,
  Card,
} from "react-bootstrap";
import { BsShareFill } from "react-icons/bs";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailers, setTrailers] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [showStickyTopBar, setShowStickyTopBar] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  const navigate = useNavigate();

  // Function to handle trailer modal
  const handleTrailerClick = (trailer) => {
    if (trailer) {
      setCurrentTrailer(trailer);
      setShowTrailer(true);
    }
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        setMovie(data);

        // Check if upcoming
        setIsUpcoming(new Date(data.release_date) > new Date());

        // Trailers (only YouTube)
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const videoData = await videoRes.json();
        const youtubeTrailers = (videoData.results || []).filter(
          (v) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailers(youtubeTrailers);

        // Auto-set first trailer
        if (youtubeTrailers.length > 0) {
          setCurrentTrailer(youtubeTrailers[0]);
        }

        // Credits
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast || []);
        setCrew(creditsData.crew || []);

        // Reviews
        const reviewsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData.results || []);

        // Similar movies
        const similarRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const similarData = await similarRes.json();
        if (similarData.results?.length > 0) {
          setSimilarMovies(similarData.results);
        } else {
          const popularRes = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const popularData = await popularRes.json();
          setSimilarMovies(popularData.results || []);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Scroll to top on movie change and reset modals
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowTrailer(false);
    setShowNotifyModal(false);
    setCurrentTrailer(null);
    setShowReviewModal(false);
    setCurrentReview(null);
  }, [id]);

  // Handle sticky top bar
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) {
        const aboutBottom = aboutSection.getBoundingClientRect().bottom;
        setShowStickyTopBar(aboutBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (!movie) return <h2 className="text-center mt-5">Movie not found</h2>;

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  return (
    <div style={{ color: "white", minHeight: "100vh", position: "relative" }}>
      {/* Floating Share */}
      <div
        style={{
          position: "absolute",
          top: "70px",
          right: "100px",
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(6px)",
          padding: "12px 20px",
          borderRadius: "12px",
          cursor: "pointer",
          zIndex: 3,
          color: "#fff",
          fontWeight: "600",
          fontSize: "1.2rem",
        }}
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: movie.title,
              text: "Check out this movie!",
              url: window.location.href,
            });
          } else {
            alert("Sharing not supported on this browser.");
          }
        }}
      >
        <BsShareFill className="me-2" />
        Share
      </div>

      {/* Hero */}
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 0",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "absolute",
            inset: 0,
          }}
        ></div>

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded shadow"
              />
              <p className="mt-2">{isUpcoming ? "Coming Soon" : "In Cinemas"}</p>
            </Col>

            <Col md={9}>
              <h1 className="fw-bold">{movie.title}</h1>

              <div className="d-flex align-items-center my-3">
                <span className="bg-dark px-3 py-2 rounded me-3">
                  ⭐ {movie.vote_average.toFixed(1)} / 10{" "}
                  <small>({movie.vote_count} votes)</small>
                </span>
                <Button variant="light" size="sm">
                  Rate now
                </Button>
              </div>

              <div className="mb-3">
                <Badge bg="light" text="dark" className="me-2">
                  2D
                </Badge>
                <Badge bg="light" text="dark">
                  English
                </Badge>
              </div>

              <p>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m •{" "}
                {movie.genres.map((g) => g.name).join(", ")} •{" "}
                {movie.adult ? "A" : "UA16+"} • {movie.release_date}
              </p>

              <div className="d-flex gap-3 mt-3">
                {currentTrailer && (
                  <Button
                    variant="dark"
                    size="lg"
                    className="fw-bold"
                    onClick={() => handleTrailerClick(currentTrailer)}
                  >
                    ▶ Watch Trailer
                  </Button>
                )}

                {isUpcoming ? (
                  <Button
                    variant="warning"
                    size="lg"
                    className="fw-bold"
                    onClick={() => setShowNotifyModal(true)}
                  >
                    🔔 Notify Me
                  </Button>
                ) : (
                  <Button
  variant="danger"
  size="lg"
  className="fw-bold"
  onClick={() => {
    const user = localStorage.getItem("user");
    if (!user) {
      // 🔒 Trigger login modal from AppNavbar
      window.dispatchEvent(new Event("openLoginModal"));
    } else {
      navigate(`/booking/${movie.id}`);
    }
  }}
>
  🎟 Book Tickets
</Button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* About */}
      <Container id="about-section" className="py-5 bg-white text-dark">
        <h4 className="fw-bold">About the movie</h4>
        <p>{movie.overview}</p>
      </Container>

      {/* Cast */}
      <Container className="py-4 rounded mt-3">
        <h4 className="fw-bold mb-3" style={{ color: "black" }}>
          Cast
        </h4>
        <Slider {...sliderSettings}>
          {cast
            .filter((actor) => actor.profile_path)
            .map((actor) => (
              <div
                key={actor.id}
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "0px 5px",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto 8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  {actor.name}
                </p>
                <small
                  style={{
                    color: "gray",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {actor.character}
                </small>
              </div>
            ))}
        </Slider>
      </Container>

      {/* Crew */}
      <Container className="py-4 rounded mt-3 mb-5">
        <h4 className="fw-bold mb-3" style={{ color: "black" }}>
          Crew
        </h4>
        <Slider {...sliderSettings}>
          {crew
            .filter((member) => member.profile_path)
            .map((member) => (
              <div
                key={member.id}
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "0px 5px",
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                  alt={member.name}
                  style={{
                    width: "100%",
                    maxWidth: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    margin: "0 auto 8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  {member.name}
                </p>
                <small
                  style={{
                    color: "gray",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {member.job}
                </small>
              </div>
            ))}
        </Slider>
      </Container>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Container className="py-5">
          <h4 className="fw-bold mb-4" style={{ color: "black" }}>
            Critic Reviews
          </h4>
          <Row>
            {reviews.slice(0, 4).map((review) => (
              <Col md={6} key={review.id} className="mb-4">
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <Card.Title className="fw-bold text-dark">
                      {review.author}
                    </Card.Title>
                    <Card.Text
                      className="text-muted"
                      style={{ maxHeight: "100px", overflow: "hidden" }}
                    >
                      {review.content}
                    </Card.Text>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => {
                        setCurrentReview(review);
                        setShowReviewModal(true);
                      }}
                    >
                      Read full review →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* Similar Movies */}
      <Container className="py-4 rounded mt-3 mb-5">
        <h4 className="fw-bold mb-3" style={{ color: "black" }}>
          You might also like
        </h4>
        <Slider {...sliderSettings}>
          {similarMovies.map((m) => (
            <div
              key={m.id}
              style={{ textAlign: "center", padding: "0px 5px" }}
            >
              <Link
                to={`/movie/${m.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                  alt={m.title}
                  style={{
                    width: "100%",
                    maxWidth: "180px",
                    height: "270px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    margin: "0 auto 8px",
                  }}
                />
                <p className="fw-bold text-dark">{m.title}</p>
              </Link>
            </div>
          ))}
        </Slider>
      </Container>

      {/* Sticky Top Bar */}
      {showStickyTopBar && movie && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderBottom: "2px solid #ddd",
            padding: "12px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2000,
            animation: "fadeInSticky 0.4s ease-out forwards",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "50px", height: "70px", borderRadius: "6px" }}
              />
            )}
            <h3
              className="mb-0 text-dark fw-bold"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              {movie.title}
            </h3>
          </div>
          {isUpcoming ? (
            <Button
              variant="warning"
              size="lg"
              className="fw-bold"
              onClick={() => setShowNotifyModal(true)}
            >
              🔔 Notify Me
            </Button>
          ) : (
            <Button
  variant="danger"
  size="lg"
  className="fw-bold"
  onClick={() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.dispatchEvent(new Event("openLoginModal"));
    } else {
      navigate(`/booking/${movie.id}`);
    }
  }}
>
  🎟 Book Tickets
</Button>
          )}
        </div>
      )}

      {/* Trailer Modal */}
      <Modal
        show={showTrailer}
        onHide={() => setShowTrailer(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentTrailer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {currentTrailer ? (
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${currentTrailer.key}`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No trailer available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Notify Modal */}
      <Modal
        show={showNotifyModal}
        onHide={() => setShowNotifyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🔔 Notify Me</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Enter your email to get notified when <strong>{movie.title}</strong>{" "}
            is released.
          </p>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNotifyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              if (!notifyEmail) {
                alert("⚠ Please enter a valid email!");
                return;
              }
              alert(
                `✅ You will be notified at ${notifyEmail} when ${movie.title} releases!`
              );
              setNotifyEmail("");
              setShowNotifyModal(false);
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Review Modal */}
      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentReview?.author}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{currentReview?.content}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MovieDetailsPage;
