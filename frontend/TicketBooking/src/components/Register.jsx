import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }
  try {
    await axios.post("http://localhost:8082/api/users/register", formData);
    toast.success("Registration successful! Please login.");
    navigate("/"); // redirect to login or home
  } catch (err) {
    console.error("Registration error:", err.response ? err.response.data : err.message);
    toast.error("Registration failed: " + (err.response ? err.response.data : err.message));
  }
};

  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="p-4 shadow-lg register-card position-relative">
            {/* Cross icon */}
            <Button
              variant="light"
              className="close-button"
              onClick={() => navigate("/")}
            >
              ✕
            </Button>

            <h2 className="text-center text-warning mb-4">Register</h2>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                className="w-100 fw-bold"
              >
                Register
              </Button>
            </Form>

            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Button
                variant="link"
                onClick={() => navigate("/")}
                className="p-0"
              >
                Login
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
