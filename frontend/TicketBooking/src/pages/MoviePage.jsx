import React, { useState, useEffect, useCallback, useRef } from "react";
import HeroSection from "./HeroSection";
import FilterMovies from "./FilterMovies";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const MoviePage = () => {
  const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";

  const [filters, setFilters] = useState({ languages: [], genres: [], formats: [] });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const availableFormats = ["2D", "3D", "IMAX", "4DX"];
  const containerRef = useRef(null);

  const assignRandomFormats = (movies) =>
    movies.map((m) => ({
      ...m,
      format: availableFormats[Math.floor(Math.random() * availableFormats.length)],
    }));

  // Calculate how many movies are needed to fill viewport
  const getMoviesPerScreen = () => {
    const rowHeight = 400; // Approximate height of one movie card
    const rows = Math.ceil(window.innerHeight / rowHeight) + 2; // +2 as buffer
    const columns = 4; // 4 columns in large screen
    return rows * columns;
  };

  const fetchFilteredMovies = async (page = 1, append = false, accumulated = []) => {
    if (page > totalPages) {
      const finalMovies = append
        ? Array.from(new Map([...movies, ...accumulated].map((m) => [m.id, m])).values())
        : Array.from(new Map(accumulated.map((m) => [m.id, m])).values());

      // Sort globally by rating
      finalMovies.sort((a, b) => b.vote_average - a.vote_average);
      setMovies(finalMovies);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&region=IN&page=${page}`
      );
      const data = await res.json();
      if (data.total_pages) setTotalPages(data.total_pages);

      let results = data.results || [];
      results = results.filter((movie) => movie.poster_path && movie.vote_average > 0);

      // Apply filters
      if (filters.languages.length > 0) {
        results = results.filter((movie) => filters.languages.includes(movie.original_language));
      }
      if (filters.genres.length > 0) {
        results = results.filter((movie) =>
          movie.genre_ids.some((gid) => filters.genres.includes(gid))
        );
      }

      results = assignRandomFormats(results);

      if (filters.formats.length > 0) {
        results = results.filter((movie) => filters.formats.includes(movie.format));
      }

      // Deduplicate against accumulated movies
      const existingIds = new Set(accumulated.map((m) => m.id));
      const newUnique = results.filter((m) => !existingIds.has(m.id));

      const combined = [...accumulated, ...newUnique];

      // Calculate required number of movies to fill screen
      const minMoviesPerLoad = getMoviesPerScreen();

      // Fetch next page if not enough movies
      if (combined.length < minMoviesPerLoad && page < data.total_pages) {
        fetchFilteredMovies(page + 1, append, combined);
      } else {
        const finalMovies = append
          ? Array.from(new Map([...movies, ...combined].map((m) => [m.id, m])).values())
          : Array.from(new Map(combined.map((m) => [m.id, m])).values());

        finalMovies.sort((a, b) => b.vote_average - a.vote_average);
        setMovies(finalMovies);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setLoading(false);
    }
  };

  // Reset movies & page when filters change
  useEffect(() => {
    setMovies([]);
    setCurrentPage(1);
    fetchFilteredMovies(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
      !loading &&
      currentPage < totalPages
    ) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchFilteredMovies(nextPage, true);
    }
  }, [currentPage, totalPages, loading, movies]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container fluid ref={containerRef}>
      <HeroSection apiKey={TMDB_API_KEY} />
      <Row style={{ margin: "80px 160px" }}>
        <Col md={3}>
          <FilterMovies onFilterChange={setFilters} showReleaseMonth={false} />
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3 px-2 py-2 bg-light rounded">
            <h5 className="mb-0 fw-bold">Coming Soon</h5>
            <Link to="/upcoming" className="text-danger fw-semibold text-decoration-none">
              Explore Upcoming Movies →
            </Link>
          </div>

          <Row className="g-4 mt-3">
            {movies.map((movie) => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>
                        ⭐ {movie.vote_average} | 📅 {movie.release_date} | 🎬 {movie.format}
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
            <p className="text-center mt-4 text-muted">No movies found.</p>
          )}
        </Col>
      </Row>
      <Footer/>
    </Container>
  );
};

export default MoviePage;
