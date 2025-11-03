import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";
import MovieDetails from "./pages/MovieDetails";
import StreamPage from "./pages/StreamPage";
import StreamDetails from "./pages/StreamDetailsPage";
import BookingPage from "./pages/BookingPage";
import UpcomingMoviesPage from "./pages/UpcomingMoviesPage";
import EventsPage from "./pages/EventsPage";
import EventDetails from "./pages/EventDetails";
import SearchPage from "./components/SearchResultsPage";
import LoginModal from "./components/Login"; // ✅ renamed for clarity
import Register from "./components/Register";
import ProfilePage from "./pages/ProfilePage";
import MyBookings from "./pages/MyBookingsPage";
import EventBookingModal from "./pages/EventBookingModal";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentPage from "./pages/Paymentpage";
import SettingsPage from "./pages/SettingPage";
import Footer from "./pages/Footer";

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];

  // ✅ Centralized login modal control
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Show Navbar on all routes except login/register */}
      {!hideNavbarPaths.includes(location.pathname) && (
        <AppNavbar setShowLogin={setShowLogin} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />

        {/* Protected + Shared Routes */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/movie/:id" element={<MovieDetails setShowLogin={setShowLogin} />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/event/:id" element={<EventDetails setShowLogin={setShowLogin} />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/stream/:type/:id" element={<StreamDetails />} />
        <Route path="/booking/:movieId" element={<BookingPage />} />
        <Route path="/upcoming" element={<UpcomingMoviesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/event-booking/:eventId" element={<EventBookingModal/>} />
        <Route path="/my-bookings" element={<MyBookings/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/footer" element={<Footer/>}/>


      </Routes>

      {/* ✅ Centralized login modal (shared by Navbar and MovieDetails) */}
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
