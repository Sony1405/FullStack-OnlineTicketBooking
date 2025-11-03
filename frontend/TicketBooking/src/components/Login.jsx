import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css"

const LoginModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8082/api/users/login", formData);
    localStorage.setItem("user", JSON.stringify(response.data));
    toast.success("Login successful!");
onHide();
setTimeout(() => {
  window.location.reload();
}, 1000); // wait 1 second for toast to display

  } catch (err) {
    toast.error("Invalid email or password!");
  }
};

  // Animation variants for modal
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="custom-modal-wrapper">
          {/* Modal overlay */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onHide} // clicking outside closes modal
          />

          {/* Animated modal */}
          <motion.div
            className="custom-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close Button */}
                <button
                type="button"
                className="modal-close-btn"
                onClick={onHide}
                >
                &times;
                </button>

            <h3 className="fw-bold text-warning mb-3 text-center">Sign In</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </Form.Group>

              <Button variant="warning" type="submit" className="w-100 fw-bold">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <Button
                variant="link"
                onClick={() => {
                  onHide();
                  navigate("/register");
                }}
              >
                Register
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
