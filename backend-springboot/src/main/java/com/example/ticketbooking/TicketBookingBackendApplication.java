package com.example.ticketbooking;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class TicketBookingBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketBookingBackendApplication.class, args);
	}

}
