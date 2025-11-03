package com.example.ticketbooking;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {
	
	 @Autowired
	    private NotificationRepository notificationRepository;

	    // ✅ Get all notifications (newest first)
	    @GetMapping("/{userId}")
	    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
	        List<Notification> list = notificationRepository.findByUserIdOrderByTimestampDesc(userId);
	        return ResponseEntity.ok(list);
	    }

	    // ✅ Get only unread notifications
	    @GetMapping("/unread/{userId}")
	    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
	        List<Notification> list = notificationRepository.findByUserIdAndReadFalse(userId);
	        return ResponseEntity.ok(list);
	    }

	    // ✅ Add new notification
	    @PostMapping("/add")
	    public ResponseEntity<Notification> addNotification(@RequestBody Notification n) {
	        return ResponseEntity.ok(notificationRepository.save(n));
	    }

	    // ✅ Mark all unread notifications as read (this is the key method)
	    @PutMapping("/mark-as-read/{userId}")
	    public ResponseEntity<String> markAllAsRead(@PathVariable Long userId) {
	        List<Notification> list = notificationRepository.findByUserIdAndReadFalse(userId);
	        list.forEach(n -> n.setRead(true));
	        notificationRepository.saveAll(list);
	        return ResponseEntity.ok("All notifications marked as read");
	    }
	    @DeleteMapping("/clear/{userId}")
	    public ResponseEntity<String> clearNotifications(@PathVariable Long userId) {
	        try {
	            System.out.println("Attempting to delete notifications for userId: " + userId);
	            notificationRepository.deleteByUserId(userId);
	            System.out.println("Deletion successful for userId: " + userId);
	            return ResponseEntity.ok("Notifications cleared successfully");
	        } catch (Exception e) {
	            System.err.println("Error deleting notifications for userId: " + userId);
	            e.printStackTrace();
	            return ResponseEntity.status(500).body("Failed to clear notifications");
	        }
	    }


}
