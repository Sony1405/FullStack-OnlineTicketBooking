package com.example.ticketbooking;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
	@GetMapping("/")
	public String home()
	{
		return "Your backend is running successfully 🎉 ";
	}

}
