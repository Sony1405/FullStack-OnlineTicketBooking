import React, { useState } from "react";
import { Carousel, Card, Button, Badge, Modal, Row, Col } from "react-bootstrap";

const MoviesSection = () => {

    const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    genre: "Action, Sci-Fi",
    duration: "3h 2m",
    rating: 8.4,
    poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    showtimes: ["10:00 AM", "2:30 PM", "7:00 PM"],
    description: "The Avengers assemble once more to undo Thanos' destruction.",
    cast: "Robert Downey Jr, Chris Evans, Scarlett Johansson",
    trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
  },
  {
    id: 2,
    title: "La La Land",
    genre: "Romance, Musical",
    duration: "2h 8m",
    rating: 8.0,
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    showtimes: ["11:00 AM", "3:00 PM", "8:00 PM"],
    description: "A jazz pianist falls for an aspiring actress in Los Angeles.",
    cast: "Ryan Gosling, Emma Stone",
    trailer: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
  },
  {
    id: 3,
    title: "Inception",
    genre: "Thriller, Sci-Fi",
    duration: "2h 28m",
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    showtimes: ["9:30 AM", "1:30 PM", "6:30 PM"],
    description: "A thief steals corporate secrets through dream-sharing technology.",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt",
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  },
];

// ⭐ Trending Movies (fake community picks)
const trending = ["Joker", "Spider-Man: No Way Home", "Avatar 2", "KGF 2", "RRR"];

// 🎭 Mood-based movie matching
const moodMap = {
  Happy: ["La La Land"],
  Chill: ["Inception"],
  Excited: ["Avengers: Endgame"],
  Romantic: ["La La Land"],
  Adventurous: ["Inception"],
};

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowDetails = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };
  return (
    <div>
         <section className="py-5  text-light">
      <div className="container">
        <h2 className="text-center mb-5 text-dark">🍿 Movieverse – Now Showing</h2>

        {/* 🍿 Carousel Section */}
        <Carousel className="mb-5">
          {movies.map((movie) => (
            <Carousel.Item key={movie.id}>
              <img
                className="d-block w-100"
                src={movie.poster}
                alt={movie.title}
                style={{ height: "500px", objectFit: "cover" }}
              />
              <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-3">
                <h3>{movie.title}</h3>
                <p>{movie.genre} • {movie.duration}</p>
                <Button variant="warning" onClick={() => handleShowDetails(movie)}>
                  🎟️ Book Tickets
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* ⭐ Trending Community Picks */}
        <h4 className="mb-3 text-dark">⭐ Community Picks</h4>
        <div className="mb-4">
          {trending.map((title, idx) => (
            <Badge bg="info" className="me-2" key={idx}>
              {title}
            </Badge>
          ))}
        </div>

        {/* 📅 Movies List */}
        <Row>
          {movies.map((movie) => (
            <Col md={4} key={movie.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={movie.poster}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <Card.Body className="text-dark">
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    <strong>Genre:</strong> {movie.genre} <br />
                    <strong>Duration:</strong> {movie.duration}
                  </Card.Text>
                  <div className="mb-2">
                    <Badge bg="info" className="me-2">⭐ {movie.rating}/10</Badge>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {movie.showtimes.map((time, idx) => (
                      <Button key={idx} size="sm" variant="outline-dark">
                        {time}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="warning"
                    className="w-100 mb-2"
                    onClick={() => handleShowDetails(movie)}
                  >
                    🎟️ Book Tickets
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => handleShowDetails(movie)}
                  >
                    🎬 More Info
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 🎬 Movie Detail Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          {selectedMovie && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedMovie.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col md={5}>
                    <img
                      src={selectedMovie.poster}
                      alt={selectedMovie.title}
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col md={7}>
                    <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                    <p><strong>Duration:</strong> {selectedMovie.duration}</p>
                    <p><strong>Rating:</strong> ⭐ {selectedMovie.rating}/10</p>
                    <p><strong>Description:</strong> {selectedMovie.description}</p>
                    <p><strong>Cast:</strong> {selectedMovie.cast}</p>
                    <p><strong>Combo Deals:</strong> 🍿 Popcorn + Drink @ ₹199</p>
                    <Button
                      variant="danger"
                      href={selectedMovie.trailer}
                      target="_blank"
                      className="me-2"
                    >
                      ▶ Watch Trailer
                    </Button>
                    <Button variant="warning">🎟️ Confirm Booking</Button>
                  </Col>
                </Row>
              </Modal.Body>
            </>
          )}
        </Modal>
      </div>
    </section>
    </div>
  )
}

export default MoviesSection