import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieCard.css";

const OngoingMoviesPage = () => {
  const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const languages = [
    { code: "all", name: "All" },
    { code: "te", name: "Telugu" },
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "ja", name: "Japanese" },
    { code: "ml", name: "Malayalam" },
    { code: "ta", name: "Tamil" },
  ];

  useEffect(() => {
  const fetchMovies = async () => {
    setLoading(true);
    try {
      let results = [];
      // Fetch multiple pages (1 to 3)
      for (let page = 1; page <= 3; page++) {
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&region=IN&page=${page}`;
        const res = await axios.get(url);
        results = results.concat(res.data.results || []);
      }

      // Apply language filter
      if (selectedLanguage !== "all") {
        results = results.filter(
          (movie) => movie.original_language === selectedLanguage
        );
      }

      const formattedMovies = results
        .map((movie) => ({
          id: movie.id,
          title: movie.title || "Untitled",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
          release_date: movie.release_date || "N/A",
          language: movie.original_language.toUpperCase(),
          vote_average: movie.vote_average || 0,
          vote_count: movie.vote_count || 0,
        }))
        // Keep only movies with at least 1 vote
        .filter((movie) => movie.vote_count > 0)
        // Sort by rating descending
        .sort((a, b) => b.vote_average - a.vote_average);

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Error fetching ongoing movies:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchMovies();
}, [selectedLanguage]);


  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🎬 Now Playing Movies</h2>

      {/* Language Filter Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`btn btn-sm ${
              selectedLanguage === lang.code
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setSelectedLanguage(lang.code)}
          >
            {lang.name}
          </button>
        ))}
      </div>

      {/* Movie Carousel */}
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : movies.length > 0 ? (
        <Slider {...sliderSettings}>
          {movies.map((movie) => (
            <div key={movie.id} className="p-2">
              <Card
                className="movie-card shadow-sm position-relative"
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                />

                {/* Rating and Votes Overlay */}
                  {movie.vote_count > 0 && (
                    <div
                      className="rating-overlay text-light gap-2"
                      style={{
                        fontWeight: "600",
                        fontSize: "0.95rem",
                      }}
                    >
                      ⭐ {movie.vote_average.toFixed(1)}/10
                      <span style={{ fontSize: "0.85rem", color: "#ccc" }}>
                        {movie.vote_count >= 1000
                          ? (movie.vote_count / 1000).toFixed(1) + "K+ Votes"
                          : movie.vote_count + " Votes"}
                      </span>
                    </div>
                  )}


                {/* Movie Details */}
                <div className="movie-details p-2 text-center">
                  <h5 className="title mb-1">{movie.title}</h5>
                  <p className="text-muted mb-0">
                    📅 {movie.release_date} | 🌐 {movie.language}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-muted">
          No movies available for the selected language.
        </p>
      )}
    </div>
  );
};

export default OngoingMoviesPage;
