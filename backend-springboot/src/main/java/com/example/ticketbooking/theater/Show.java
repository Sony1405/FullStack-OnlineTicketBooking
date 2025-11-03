package com.example.ticketbooking.theater;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Show {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String movieTitle; // from TMDB
	    private String showTime;
	    private Double ticketPrice;

	    @ManyToOne
	    @JoinColumn(name = "theatre_id")
	    private Theatre theatre;

}
