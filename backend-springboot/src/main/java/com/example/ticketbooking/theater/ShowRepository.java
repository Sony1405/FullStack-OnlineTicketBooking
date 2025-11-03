package com.example.ticketbooking.theater;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByMovieTitleIgnoreCase(String movieTitle);

}
