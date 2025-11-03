import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FilterMovies from "./FilterMovies";

const UpcomingMoviesPage = () => {
  const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

  const [filters, setFilters] = useState({
    languages: [],
    genres: [],
    formats: [],
    releaseMonths: [],
  });

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const availableFormats = ["2D", "3D", "IMAX", "4DX"];

  // helper: assign random formats
  const assignRandomFormats = (movies) =>
    movies.map((m) => ({
      ...m,
      format:
        availableFormats[Math.floor(Math.random() * availableFormats.length)],
    }));

  const fetchMovies = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const baseUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&region=IN&page=${page}`;
      const res = await fetch(baseUrl);
      const data = await res.json();

      if (data.total_pages) setTotalPages(data.total_pages);

      let results = data.results || [];

      // ✅ Keep only upcoming movies with poster images
      const today = new Date();
      results = results.filter(
        (movie) =>
          movie.release_date &&
          movie.poster_path &&
          new Date(movie.release_date) >= today
      );

      // ✅ Language filter
      if (filters.languages.length > 0) {
        results = results.filter((movie) =>
          filters.languages.includes(movie.original_language)
        );
      }

      // ✅ Genre filter
      if (filters.genres.length > 0) {
        results = results.filter((movie) =>
          movie.genre_ids.some((gid) => filters.genres.includes(gid))
        );
      }

      // ✅ Assign random formats
      let moviesWithFormats = assignRandomFormats(results);

      // ✅ Format filter
      if (filters.formats.length > 0) {
        moviesWithFormats = moviesWithFormats.filter((m) =>
          filters.formats.includes(m.format)
        );
      }

      // ✅ Release Month filter
      if (filters.releaseMonths.length > 0) {
        moviesWithFormats = moviesWithFormats.filter((movie) => {
          if (!movie.release_date) return false;
          const month = new Date(movie.release_date).getMonth() + 1;
          return filters.releaseMonths.includes(month);
        });
      }

      setMovies((prev) =>
        append ? [...prev, ...moviesWithFormats] : moviesWithFormats
      );
    } catch (err) {
      console.error("Error fetching upcoming movies:", err);
    }
    setLoading(false);
  };

  // fetch first page or whenever filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1, false);
  }, [filters, TMDB_API_KEY]);

  // infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
      !loading &&
      currentPage < totalPages
    ) {
      const nextPage = currentPage + 1;
      fetchMovies(nextPage, true);
      setCurrentPage(nextPage);
    }
  }, [currentPage, totalPages, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container fluid>
      <Row style={{ margin: "80px 160px" }}>
        {/* Filters (Left) */}
        <Col md={3}>
          <FilterMovies onFilterChange={setFilters} showReleaseMonth={true} />
        </Col>

        {/* Movies (Right) */}
        <Col md={9}>
          {/* Section Header */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-2 py-2 bg-light rounded">
            <h5 className="mb-0 fw-bold">Now Showing</h5>
            <Link
              to="/movies"
              className="text-danger fw-semibold text-decoration-none"
            >
              In Cinemas near you →
            </Link>
          </div>

          <Row className="g-4 mt-3">
            {movies.map((movie) => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Link
                  to={`/movie/${movie.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>
                        📅 Release: {movie.release_date}
                        <br />
                        🎥 Format: {movie.format}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>

          {loading && (
            <div className="d-flex justify-content-center mt-4">
              <Spinner animation="border" variant="danger" />
            </div>
          )}

          {!loading && movies.length === 0 && (
            <p className="text-center mt-4 text-muted">No upcoming movies found.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UpcomingMoviesPage;
