package com.example.ticketbooking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	 List<Notification> findByUserIdOrderByTimestampDesc(Long userId);
	 List<Notification> findByUserIdAndReadFalse(Long userId); // ✅ needed for unread feature
	 
	 @Transactional
	    @Modifying
	    void deleteByUserId(Long userId); // ✅ fix here


}
