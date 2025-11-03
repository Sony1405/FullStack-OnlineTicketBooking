import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Dropdown,
  Button,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaTicketAlt, FaMoon, FaBell, FaSun } from "react-icons/fa";
import "./AppNavbar.css";
import axios from "axios";
import { useEffect, useState } from "react";
import LoginModal from "../components/Login";

const AppNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  // ✅ Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  // ✅ Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // ✅ Fetch unread notifications count
  const fetchNotificationCount = async () => {
    if (user?.id) {
      try {
        const res = await axios.get(
          `http://localhost:8082/api/notifications/unread/${user.id}`
        );
        setNotificationCount(res.data.length || 0);
      } catch (err) {
        setNotificationCount(0);
      }
    }
  };

  useEffect(() => {
    fetchNotificationCount();
  }, [user]);

  useEffect(() => {
    const handleNotificationAdded = () => {
      fetchNotificationCount();
    };
    const handleRefreshNotifications = () => {
      fetchNotificationCount();
    };

    window.addEventListener("notificationAdded", handleNotificationAdded);
    window.addEventListener("refreshNotifications", handleRefreshNotifications);

    return () => {
      window.removeEventListener("notificationAdded", handleNotificationAdded);
      window.removeEventListener(
        "refreshNotifications",
        handleRefreshNotifications
      );
    };
  }, [user]);

  useEffect(() => {
    const handleOpenLogin = () => setShowLogin(true);
    window.addEventListener("openLoginModal", handleOpenLogin);
    return () => window.removeEventListener("openLoginModal", handleOpenLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // ✅ Redirect to Home page
    window.location.reload(); // Optional: refresh app state
  };

  const isSearchPage = location.pathname === "/search";

  return (
    <>
      {showLogin && <div className="overlay-blur"></div>}

      <Navbar
        expand="lg"
        sticky="top"
        className={`navbar-glass ${scrolled ? "scrolled" : ""} ${
          isSearchPage ? "hidden" : ""
        }`}
      >
        <Container fluid className="px-5">
          {!isSearchPage && (
            <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning">
              🎟 BookItNow
            </Navbar.Brand>
          )}

          {!isSearchPage && (
            <div className="ms-auto w-50 position-relative">
              <Form className="d-flex w-100">
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#888",
                  }}
                />
                <FormControl
                  type="search"
                  placeholder="Search for Movies, Events, Plays & more"
                  className="rounded-pill"
                  style={{
                    paddingLeft: "35px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                  readOnly
                  onClick={() => (window.location.href = "/search")}
                />
              </Form>
            </div>
          )}

          {user ? (
            !isSearchPage && (
              <Nav className="align-items-center gap-3 ms-3">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                <Nav.Link as={Link} to="/events">Events</Nav.Link>
                <Nav.Link as={Link} to="/stream">Stream</Nav.Link>

                <Nav.Link as={Link} to="/my-bookings">
                  <FaTicketAlt size={18} className="icon-ticket" />
                </Nav.Link>

                {/* ✅ Notification Bell */}
                <Nav.Link
                  as={Link}
                  to="/notifications"
                  className="position-relative"
                >
                  <FaBell size={18} className="icon-bell" />
                  {notificationCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "2px",
                        background: "red",
                        borderRadius: "50%",
                        padding: "2px 5px",
                        fontSize: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </Nav.Link>

                {/* 🌙 Dark Mode Toggle */}
                <Nav.Link onClick={toggleDarkMode} title="Toggle theme">
                  {darkMode ? (
                    <FaSun size={16} className="icon-moon" color="#FFD700" />
                  ) : (
                    <FaMoon size={16} className="icon-moon" color="black" />
                  )}
                </Nav.Link>

                {/* ✅ Profile Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="profile-dropdown"
                    className="d-flex align-items-center gap-2"
                  >
                    👤
                    <span className="fw-semibold text-dark">
                      {user?.name || "User"}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/my-bookings")}>
                      My Bookings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/settings")}>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            )
          ) : (
            !isSearchPage && (
              <Nav className="align-items-center ms-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowLogin(true)}
                >
                  Sign In
                </Button>
              </Nav>
            )
          )}
        </Container>
      </Navbar>

      {/* Login Modal */}
      {location.pathname !== "/register" && (
        <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      )}
    </>
  );
};

export default AppNavbar;
