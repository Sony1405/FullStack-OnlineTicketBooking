package com.example.ticketbooking.theater;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Theatre {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String showTime;     // Example: 10:30 AM
    private Double ticketPrice;  // Example: 250.00

}
