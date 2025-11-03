package com.example.ticketbooking;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "event_bookings")
public class EventBooking {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String eventId;       // event unique id
    private String eventTitle;    // event name
    private String date;          // selected date
    private String time;          // selected time slot
    private String seats;         // selected seats (comma separated)
    private double totalAmount;   // total cost
    @Column(length = 1000)
    private String image;
    private String seatType;

}
