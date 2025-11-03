package com.example.ticketbooking;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Notification {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String title;
    private String message;

    @Column(name = "is_read")  // ✅ avoid reserved keyword
    private boolean read = false;

    private LocalDateTime timestamp = LocalDateTime.now();
    


}
