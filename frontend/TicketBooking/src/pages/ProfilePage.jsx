import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt } from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8082/api/users/${userId}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [userId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, avatar: reader.result };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Spinner animation="border" variant="warning" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-5">
        <p>No user found. Please log in again.</p>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="profile-container container py-5">
      <Card className="profile-card shadow-lg border-0 position-relative">
        <button className="profile-close-btn" onClick={() => navigate("/")}>
          &times;
        </button>

        <Card.Body>
          <Row className="align-items-center gy-4">
            {/* Left Side */}
            <Col md={4} className="text-center border-end border-secondary">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="avatar-img" />
                ) : (
                  <span>{user.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <Button
                variant="outline-warning"
                className="mt-3 w-75"
                onClick={() => document.getElementById("avatarUpload").click()}
              >
                📷 Upload Avatar
              </Button>

              <h4 className="mt-3 fw-bold text-warning">{user.name}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              <p className="badge bg-dark text-warning px-3 py-2">
                Premium Member
              </p>
              <Button
                variant="outline-warning"
                className="mt-3 w-75"
                onClick={() => setShowEdit(true)}
              >
                ✏️ Edit Profile
              </Button>
            </Col>

            {/* Right Side */}
            <Col md={8}>
              <h5 className="fw-bold text-warning mb-4 border-bottom pb-2">
                Account Details
              </h5>

              <div className="details-grid">
                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <div>
                    <p className="label">Full Name</p>
                    <p className="value">{user.name || "N/A"}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <p className="label">Email Address</p>
                    <p className="value">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="detail-item">
                    <FaPhoneAlt className="detail-icon" />
                    <div>
                      <p className="label">Phone Number</p>
                      <p className="value">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div>
                    <p className="label">Member Since</p>
                    <p className="value">
                      {new Date().toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {showEdit && (
        <EditProfileModal
          show={showEdit}
          onHide={() => setShowEdit(false)}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
};

export default ProfilePage;
