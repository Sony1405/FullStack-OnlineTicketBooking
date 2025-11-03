package com.example.ticketbooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bookings")
public class MovieBookingController {
	@Autowired
    private MovieBookingRepository movieBookingRepository;

    @Autowired
    private NotificationRepository notificationRepository; // ✅ added for notifications

    // ✅ Create booking and generate notification
    @PostMapping("/add")
    public MovieBooking createBooking(@RequestBody MovieBooking booking) {
        MovieBooking savedBooking = movieBookingRepository.save(booking);

        // ✅ Create a notification when booking is successful
        Notification notification = new Notification();
        notification.setUserId(booking.getUserId());
        notification.setTitle("Movie Booking Confirmed 🎬");
        notification.setMessage("Your ticket for '" + booking.getMovieTitle() + "' has been booked successfully!");
        notificationRepository.save(notification);

        return savedBooking;
    }

    // Get bookings by user ID
    @GetMapping("/user/{userId}")
    public List<MovieBooking> getBookingsByUser(@PathVariable Long userId) {
        return movieBookingRepository.findByUserId(userId);
    }

    // (Optional) Get all bookings
    @GetMapping("/all")
    public List<MovieBooking> getAllBookings() {
        return movieBookingRepository.findAll();
    }

}
