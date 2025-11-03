import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import { FaFilm } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./RecommendedMovies.css";

const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

const RecommendedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
          params: {
            api_key: TMDB_API_KEY,
            sort_by: "popularity.desc",
            "primary_release_date.gte": "2025-01-01",
            "primary_release_date.lte": "2025-12-31",
            include_adult: false,
            page: 1,
          },
        });
        setMovies(res.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <Container fluid className="recommended-section my-5">
      <div className="d-flex align-items-center mb-3">
        <FaFilm className="text-warning me-2" size={22} />
        <h3 className="fw-bold m-0">Recommended Movies For You</h3>
      </div>

      <div className="recommended-slider-container">
        <Slider {...sliderSettings}>
          {movies.length > 0 ? (
            movies
              .filter((movie) => movie.poster_path)
              .map((movie) => (
                <div
                  key={movie.id}
                  className="recommended-slide"
                  onClick={() => handleCardClick(movie.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Card className="recommended-card">
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      className="recommended-img"
                    />
                    <Card.Body>
                      <Card.Title className="movie-title">
                        {movie.title}
                      </Card.Title>
                      <Card.Text className="movie-date">
                        Release: {new Date(movie.release_date).toDateString()}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))
          ) : (
            <p className="text-muted text-center w-100">No 2025 movies found.</p>
          )}
        </Slider>
      </div>
    </Container>
  );
};

export default RecommendedMovies;
