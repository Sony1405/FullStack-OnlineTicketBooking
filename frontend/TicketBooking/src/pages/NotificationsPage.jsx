import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Spinner, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // ✅ 1. Fetch notifications
        const res = await axios.get(
          `http://localhost:8082/api/notifications/${user?.id}`
        );
        setNotifications(res.data);

        // ✅ 2. Mark all as read
        await axios.put(
          `http://localhost:8082/api/notifications/mark-as-read/${user?.id}`
        );

        // ✅ 3. Update frontend immediately
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

        // ✅ 4. Refresh navbar notification count
        setTimeout(() => {
          window.dispatchEvent(new Event("refreshNotifications"));
        }, 300);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load notifications ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  // ✅ Clear all notifications for the user
  const clearNotifications = async () => {
    if (!user) return;

    try {
      await axios.delete(`http://localhost:8082/api/notifications/clear/${user.id}`);
      setNotifications([]);
      toast.success("Notification history cleared ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history ❌");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h3>🔔 Notifications</h3>
        </Col>
        {notifications.length > 0 && (
          <Col className="text-end">
            <Button variant="danger" onClick={clearNotifications}>
              Clear History
            </Button>
          </Col>
        )}
      </Row>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((n) => (
          <Card
            key={n.id}
            className={`mb-3 shadow-sm ${n.read ? "bg-light" : "bg-white"}`}
          >
            <Card.Body>
              <Card.Title>{n.title}</Card.Title>
              <Card.Text>{n.message}</Card.Text>
              <small className="text-muted">
                {new Date(n.timestamp).toLocaleString()}
              </small>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default NotificationsPage;
