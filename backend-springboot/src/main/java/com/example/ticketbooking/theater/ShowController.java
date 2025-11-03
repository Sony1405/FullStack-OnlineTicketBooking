package com.example.ticketbooking.theater;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:5173")
public class ShowController {
	@Autowired
    private ShowRepository showRepository;

    @GetMapping("/movie")
    public ResponseEntity<List<Show>> getShowsByMovie(@RequestParam String title) {
        List<Show> shows = showRepository.findByMovieTitleIgnoreCase(title);
        return ResponseEntity.ok(shows);
    }

    @PostMapping("/add")
    public ResponseEntity<Show> addShow(@RequestBody Show show) {
        return ResponseEntity.ok(showRepository.save(show));
    }

}
