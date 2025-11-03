package com.example.ticketbooking.theater;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@CrossOrigin(origins = "http://localhost:5173")
public class TheaterController {
	 @Autowired
	    private TheatreRepository theatreRepository;

	    // ✅ Get all theatres
	    @GetMapping
	    public List<Theatre> getAllTheatres() {
	        return theatreRepository.findAll();
	    }

	    

}
