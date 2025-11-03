package com.example.ticketbooking;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link back to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String movieTitle;
    private Long movieId;

    private LocalDate bookingDate;
    private LocalTime showTime;

    @ElementCollection
    @CollectionTable(name = "booking_seats", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "seat")
    private Set<String> seats;

    private Double totalPrice;
}
