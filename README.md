#  Full Stack Online Ticket Booking Project

## Project Description
This is a **Full Stack Web Application** that allows users to **book movie and event tickets online**.  
Users can explore available movies or events, select seats, make payments, and view their booking history.  
The project uses **React.js** for the frontend, **Spring Boot** for the backend, and **MySQL** for the database.  

This system provides a smooth user experience with secure booking and real-time data synchronization between frontend and backend.

---

## 📁 Folder Structure
- **backend-springboot** → Spring Boot backend (API + database)
- **frontend/TicketBooking** → React frontend (UI)

---

## How to Run

### Frontend
```bash
cd frontend/TicketBooking
npm install
npm start

### Backend
cd backend-springboot
mvn spring-boot:run




Notes

Make sure MySQL is running before starting the backend.

Update your application.properties file with your MySQL username, password, and database name.

Frontend runs on http://localhost:5173/

Backend runs on http://localhost:8082/

Run both simultaneously for full functionality.