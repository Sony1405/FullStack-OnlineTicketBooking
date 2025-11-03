package com.example.ticketbooking;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // allow your frontend
public class UserController {
	@Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) throws Exception {
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) throws Exception {
        return userService.login(user.getEmail(), user.getPassword());
    }
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) throws Exception {
        return userService.getUser(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) throws Exception {
        return userService.updateUser(id, updatedUser);
    }

    @PutMapping("/{id}/password")
    public String updatePassword(@PathVariable Long id, @RequestBody Map<String, String> passwords) throws Exception {
        userService.updatePassword(id, passwords.get("currentPassword"), passwords.get("newPassword"));
        return "Password updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) throws Exception {
        userService.deleteUser(id);
        return "User deleted successfully";
    }

}
