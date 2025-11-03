package com.example.ticketbooking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {

	 List<EventBooking> findByUserId(Long userId); // ✅ Add this line
}
