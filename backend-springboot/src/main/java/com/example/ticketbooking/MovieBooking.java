package com.example.ticketbooking;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieBooking {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String movieId;
    private String movieTitle;
    private String date;
    private String time;
    private String seats;
    private Double totalAmount;
    private String posterPath;
    private String theatreName;

}
