import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./Footer";

const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

const categories = [
  { title: "Airing Today", endpoint: "/tv/airing_today" },
  { title: "Currently Airing", endpoint: "/tv/on_the_air" },
  { title: "Trending Now", endpoint: "/trending/all/week" },
  { title: "Top Rated Movies", endpoint: "/movie/top_rated" },
  { title: "Popular Movies", endpoint: "/movie/popular" },
  { title: "Popular TV Shows", endpoint: "/tv/popular" },
  { title: "Top Rated TV Shows", endpoint: "/tv/top_rated" },
  { title: "Action Movies", endpoint: "/discover/movie?with_genres=28" },
  { title: "Comedy Movies", endpoint: "/discover/movie?with_genres=35" },
  { title: "Horror Movies", endpoint: "/discover/movie?with_genres=27" },
  { title: "Romance Movies", endpoint: "/discover/movie?with_genres=10749" },
  { title: "Documentaries", endpoint: "/discover/movie?with_genres=99" },
  { title: "Animation Movies", endpoint: "/discover/movie?with_genres=16" },
  { title: "Crime Series", endpoint: "/discover/tv?with_genres=80" },
  { title: "Sci-Fi & Fantasy Movies", endpoint: "/discover/movie?with_genres=878,14" },
  { title: "Kids & Animation TV Shows", endpoint: "/discover/tv?with_genres=16" },
  { title: "Mystery & Thriller", endpoint: "/discover/movie?with_genres=9648,53" },
];

const StreamingPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await axios.get(`https://api.themoviedb.org/3${cat.endpoint}`, {
              params: { api_key: TMDB_API_KEY },
            });
            return { title: cat.title, movies: res.data.results };
          })
        );

        // Aggregate all latest releases for Premieres (last 30 days)
        const premiereItems = results
          .flatMap((row) => row.movies)
          .filter((item) => {
            const date = item.release_date || item.first_air_date;
            if (!date) return false;
            const today = new Date();
            const release = new Date(date);
            const diffDays = (today - release) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 30 && item.poster_path;
          })
          .reduce((acc, item) => {
            if (!acc.find((i) => i.id === item.id)) acc.push(item);
            return acc;
          }, []);

        // Filter other sections: only latest releases (2024+) & remove duplicates from premieres
        const filteredRows = results.map((row) => ({
          ...row,
          movies: row.movies
            .filter((item) => item.poster_path)
            .filter((item) => {
              const date = item.release_date || item.first_air_date;
              if (!date) return false;
              const year = new Date(date).getFullYear();
              const isDuplicate = premiereItems.find((i) => i.id === item.id);
              return year >= 2024 && !isDuplicate;
            }),
        }));

        setRows([{ title: "Premieres", movies: premiereItems }, ...filteredRows]);
      } catch (err) {
        console.error("Error fetching TMDB data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center bg-dark text-light"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="light" />
        <span className="ms-3 fs-4">Loading content...</span>
      </div>
    );
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="bg-white text-dark min-vh-100 py-4" style={{ margin: "0px 200px" }}>
      <Container fluid>
        {rows.map((row, index) => {
          if (!row.movies.length) return null;

          return (
            <div key={index} className="mb-5">
              <h3 className="mb-3">{row.title}</h3>
              <Slider {...sliderSettings}>
                {row.movies.map((movie) => (
                  <Link
                    key={movie.id}
                    to={`/stream/${movie.media_type || (movie.title ? "movie" : "tv")}/${movie.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div
                      className="card bg-white border-0 mx-2"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: "8px",
                        width: "200px",
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        className="card-img-top"
                        alt={movie.title || movie.name}
                        style={{
                          height: "300px",
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      {row.title === "Premieres" && (
                        <span
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            backgroundColor: "#ff4c61",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            zIndex: 10,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            pointerEvents: "none",
                          }}
                        >
                          Premiere
                        </span>
                      )}
                      <div className="card-body p-2 text-center">
                        <small
                          className="fw-semibold d-block"
                          style={{ height: "40px", overflow: "hidden" }}
                        >
                          {movie.title || movie.name}
                        </small>
                      </div>
                    </div>
                  </Link>
                ))}
              </Slider>
            </div>
          );
        })}
      </Container>
      
    </div>
  );
};

export default StreamingPage;
