import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import "./HeroSection.css";

const HeroSection = ({ apiKey }) => {
  const [featuredMovies, setFeaturedMovies] = useState([]);

  const fetchMovies = async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      const lastWeekStr = lastWeek.toISOString().split("T")[0];

      const todayRes = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: apiKey,
            "primary_release_date.gte": todayStr,
            "primary_release_date.lte": todayStr,
            sort_by: "popularity.desc",
            include_adult: false,
            page: 1,
          },
        }
      );

      let movies = todayRes.data.results.filter((m) => m.poster_path);

      if (movies.length < 3) {
        const weekRes = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: apiKey,
              "primary_release_date.gte": lastWeekStr,
              "primary_release_date.lte": todayStr,
              sort_by: "popularity.desc",
              include_adult: false,
              page: 1,
            },
          }
        );

        const extraMovies = weekRes.data.results.filter((m) => m.poster_path);
        const allMovies = [...movies, ...extraMovies];
        movies = allMovies.slice(0, 3);
      } else {
        movies = movies.slice(0, 3);
      }

      setFeaturedMovies(movies);
    } catch (error) {
      console.error("Error fetching featured movies:", error);
    }
  };

  // Fetch on mount and setup daily refresh
  useEffect(() => {
    fetchMovies();

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0, 0
    );
    const msUntilMidnight = nextMidnight - now;

    const timer = setTimeout(() => {
      fetchMovies();
      // After midnight, set interval for every 24h
      setInterval(fetchMovies, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [apiKey]);

  const getImageUrl = (movie) => {
    return movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : "https://via.placeholder.com/1280x500?text=No+Image";
  };

  return (
    <Carousel fade indicators={false} className="hero-carousel">
      {featuredMovies.map((movie, index) => (
        <Carousel.Item key={index}>
          <div
            className="hero-slide d-flex align-items-end"
            style={{
              backgroundImage: `url(${getImageUrl(movie)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "500px", // adjust height as needed
            }}
          >
            <div className="hero-overlay p-4">
              <h1 className="text-white">{movie.title}</h1>
              <p className="text-white">
                {movie.release_date
                  ? `Release: ${new Date(movie.release_date).toDateString()}`
                  : "Release Date Unknown"}
              </p>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroSection;
