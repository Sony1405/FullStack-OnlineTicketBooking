package com.example.ticketbooking;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/event-bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EventBookingController {
	private final EventBookingRepository eventBookingRepository;

    @PostMapping("/add")
    public ResponseEntity<EventBooking> addEventBooking(@RequestBody EventBooking booking) {
        EventBooking saved = eventBookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }
 // Get all event bookings
    @GetMapping("/all")
    public ResponseEntity<List<EventBooking>> getAllEventBookings() {
        return ResponseEntity.ok(eventBookingRepository.findAll());
    }

    // Get bookings by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventBooking>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(eventBookingRepository.findByUserId(userId));
    }


}
