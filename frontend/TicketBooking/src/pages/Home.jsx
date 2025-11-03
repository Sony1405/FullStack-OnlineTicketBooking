import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaTicketAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import OngoingMovies from "./OngoingMovies";
import Movies from "./Movies";
import RecommendedMovies from "./RecommendedMovies";
import MusicConcerts from "../components/MusicConcerts";
import ComedyStandup from "../components/ComedyStandup";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();

  // Typewriter effect
  const [text, setText] = useState("");
  const fullText = "Step into the world of...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Updated handleAction — triggers login modal instead of redirecting to login page
  const handleAction = (targetPath) => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate(targetPath);
    } else {
      // trigger the login modal from Navbar
      window.dispatchEvent(new Event("open-login-modal"));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-center text-white position-relative"
        style={{
          height: "80vh",
          background: "linear-gradient(to right, #000000, #1a1a1a, #000000)",
          overflow: "hidden",
        }}
      >
        {/* Spotlight sweeping across background */}
        <motion.div
          className="position-absolute"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 60%)",
            pointerEvents: "none",
          }}
          animate={{ x: ["-50%", "150%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Tickets */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="position-absolute text-warning"
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: ["100vh", "-10vh"], opacity: [0, 1, 0] }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              fontSize: "20px",
            }}
          >
            <FaTicketAlt />
          </motion.div>
        ))}

        {/* Content */}
        <Container>
          <Row>
            <Col>
              <h1 className="fw-bold display-4">{text}</h1>

              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="fw-bold display-3 text-warning mt-3"
              >
                Movies & Events 🎟️
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="mt-4 fs-5 text-light"
              >
                From blockbuster movies to unforgettable live events, your next
                experience begins here.
              </motion.p>

              {/* Call-to-Action Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: [-1, 1, -1] }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Button
                  variant="warning"
                  size="lg"
                  className="fw-bold text-dark shadow-lg"
                  onClick={() => handleAction("/movies")}
                >
                  <FaTicketAlt className="me-2" />
                  Book Now
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="position-absolute bottom-0 mb-3 w-100 text-center"
        >
          <span style={{ fontSize: "24px", color: "white" }}>⬇️</span>
        </motion.div>
      </section>

      {/* Sections */}
      <OngoingMovies handleAction={handleAction} />
      <Movies handleAction={handleAction} />
      <RecommendedMovies handleAction={handleAction} />
      <MusicConcerts handleAction={handleAction} />
      <ComedyStandup handleAction={handleAction} />
      <Footer/>
    </div>
  );
};

export default Home;
