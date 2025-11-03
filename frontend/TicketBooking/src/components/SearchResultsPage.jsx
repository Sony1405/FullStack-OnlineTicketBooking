import React, { useEffect, useState } from "react";
import { Button, ListGroup, Container, Row, Col, Spinner } from "react-bootstrap";
import { Film } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchPage.css";

const TMDB_API_KEY = "cc074a2d61c1ecccdba61b796301f8a7";
const TICKETMASTER_API_KEY = "GXip7siabADLEJ3vHcCIQeTYPcyQGSfq";

const categories = ["Movies", "Events","Stream"];

const SearchPage = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Movies");

  // 🔹 Fetch trending for selected category
  const fetchTrending = async (category) => {
    setLoading(true);
    try {
      if (category === "Movies") {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}`
        );
        const movies = res.data.results.slice(0, 10).map((m) => ({
          id: m.id,
          name: m.title,
          type: "Movie",
        }));
        setTrending(movies);
      } else if (category === "Stream") {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}`
        );
        const shows = res.data.results.slice(0, 10).map((s) => ({
          id: s.id,
          name: s.name,
          type: "Stream",
        }));
        setTrending(shows);
      } else if (category === "Events") {
        const res = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&size=10`
        );
        const events =
          res.data._embedded?.events?.map((e) => ({
            id: e.id,
            name: e.name,
            type: "Event",
          })) || [];
        setTrending(events);
      }
    } catch (err) {
      console.error("Error fetching trending:", err);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch trending initially (Movies default)
  useEffect(() => {
    fetchTrending(selectedCategory);
  }, [selectedCategory]);

  // 🔹 Handle dynamic search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      let movieResults = [];
      let eventResults = [];

      if (selectedCategory === "Movies" || selectedCategory === "Stream") {
        const endpoint =
          selectedCategory === "Movies"
            ? "search/movie"
            : "search/tv";
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/${endpoint}`,
          {
            params: { api_key: TMDB_API_KEY, query: value },
          }
        );

        movieResults =
          movieResponse.data.results?.map((m) => ({
            id: m.id,
            name: m.title || m.name,
            type: selectedCategory,
          })) || [];
      }

      if (selectedCategory === "Events") {
        const eventResponse = await axios.get(
          `https://app.ticketmaster.com/discovery/v2/events.json`,
          {
            params: { apikey: TICKETMASTER_API_KEY, keyword: value, size: 10 },
          }
        );

        eventResults =
          eventResponse.data._embedded?.events?.map((e) => ({
            id: e.id,
            name: e.name,
            type: "Event",
          })) || [];
      }

      setSearchResults(
        selectedCategory === "Events" ? eventResults : movieResults
      );
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // 🔹 Handle click on search item
  const handleItemClick = (item) => {
    if (item.type === "Event") {
      navigate(`/event/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  // 🔹 Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchResults([]);
    setQuery("");
  };

  return (
    <Container fluid className="search-page-overlay bg-white vh-100 p-5 position-relative">
      {/* Close button */}
      <button className="close-btn" onClick={() => navigate(-1)}>
        ✕
      </button>

      <Row className="justify-content-center align-items-start mt-5">
        <Col md={8} className="text-center">
          {/* Centered Search Bar */}
          <div className="search-bar-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder={`Search for ${selectedCategory}`}
              autoFocus
              value={query}
              onChange={handleSearch}
            />
          </div>

          {/* Categories */}
          <div className="d-flex flex-wrap justify-content-center mt-4 mb-4 gap-2">
            {categories.map((cat, i) => (
              <Button
                key={i}
                variant={cat === selectedCategory ? "danger" : "outline-danger"}
                className="rounded-pill px-3"
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Results Section */}
          {query ? (
            <>
              <h6 className="fw-bold text-secondary text-start mt-5">
                SEARCH RESULTS
              </h6>
              {searchLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="danger" />
                </div>
              ) : searchResults.length > 0 ? (
                <ListGroup
                  variant="flush"
                  className="bg-white rounded-3 shadow-sm"
                >
                  {searchResults.map((item, i) => (
                    <ListGroup.Item
                      key={i}
                      onClick={() => handleItemClick(item)}
                      className="d-flex justify-content-between align-items-center py-3 list-hover"
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-muted small">
                          ({item.type})
                        </span>
                      </span>
                      <Film size={18} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted mt-4">No results found.</p>
              )}
            </>
          ) : (
            <>
              <h6 className="fw-bold text-secondary text-start mt-5">
                TRENDING {selectedCategory.toUpperCase()}
              </h6>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="danger" />
                </div>
              ) : (
                <ListGroup
                  variant="flush"
                  className="bg-white rounded-3 shadow-sm"
                >
                  {trending.map((item, i) => (
                    <ListGroup.Item
                      key={i}
                      onClick={() => handleItemClick(item)}
                      className="d-flex justify-content-between align-items-center py-3 list-hover"
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-muted small">
                          ({item.type})
                        </span>
                      </span>
                      <Film size={18} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
