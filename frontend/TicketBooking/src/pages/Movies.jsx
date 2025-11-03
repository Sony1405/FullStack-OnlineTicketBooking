import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieCard.css";
import LanguageFilters from "./LanguageFilters";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const navigate = useNavigate();

  const API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

 useEffect(() => {
  const fetchMovies = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const futureDate = new Date();

      // ✅ Extend range for Marathi (180 days), default 60 days
      if (selectedLanguage === "mr") {
        futureDate.setDate(futureDate.getDate() + 260);
      } else {
        futureDate.setDate(futureDate.getDate() + 60);
      }

      const future = futureDate.toISOString().split("T")[0];

      // Base API
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_date.gte=${today}&primary_release_date.lte=${future}&sort_by=popularity.desc&page=1&region=IN`;

      // ✅ Apply language filter (direct code from LanguageFilters)
      if (selectedLanguage !== "All") {
        url += `&with_original_language=${selectedLanguage}`;
      }

      const response = await axios.get(url);
      let fetchedMovies = response.data.results || [];

      // ✅ Optional: keep only not rated
      // fetchedMovies = fetchedMovies.filter((movie) => movie.vote_count === 0);

      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  fetchMovies();
}, [selectedLanguage]);





  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (

    <div className="container py-4 ">
      <h2 className="text-center mb-4">🎬 Upcoming Movies</h2>
      {/* Language Filter */}
      <LanguageFilters
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    <section className="py-5 ">
      <div className="container">
        {/* ✅ Updated heading */}

        {/* Language Filter */}

        {/* Movie Cards Carousel */}
        {movies.length > 0 ? (
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id} className="p-2">
                <Card
                  className="movie-card shadow-sm"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500x750?text=No+Image"
                    }
                    alt={movie.title}
                    className="movie-poster"
                  />

                  {/* ✅ Always show Not Rated since we filtered vote_count === 0 */}
                  <div className="rating-overlay no-rating">⭐ Not Rated</div>

                  <div className="movie-details">
                    <h5 className="title">{movie.title}</h5>
                    <p className="genre">
                      {movie.release_date
                        ? `Release: ${new Date(
                            movie.release_date
                          ).toDateString()}`
                        : "Release Date Unknown"}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center text-muted">No upcoming unrated movies found.</p>
        )}
      </div>
    </section>
    </div>
  );
};

export default Movies;
