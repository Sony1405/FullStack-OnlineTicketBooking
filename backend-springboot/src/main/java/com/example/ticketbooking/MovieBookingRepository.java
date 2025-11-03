package com.example.ticketbooking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieBookingRepository extends JpaRepository<MovieBooking, Long>{

	  List<MovieBooking> findByUserId(Long userId);
}
