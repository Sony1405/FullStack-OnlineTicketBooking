package com.example.ticketbooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/support")
public class SupportRequestController {
	 @Autowired
	    private SupportRequestRepository supportRepo;

	    @PostMapping
	    public SupportRequest submitSupportRequest(@RequestBody SupportRequest supportRequest) {
	        return supportRepo.save(supportRequest);
	    }

	    @GetMapping
	    public List<SupportRequest> getAllSupportRequests() {
	        return supportRepo.findAll();
	    }

}
