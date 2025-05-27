package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.UserDTO;
import com.example.court_management_system.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO) {
        String message = userService.registerUser(userDTO);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/login/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        UserDTO userDTO = userService.getUserByUserName(username);
        return ResponseEntity.ok(userDTO);
    }
    
    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody UserDTO loginRequest) {
    UserDTO userDTO = userService.getUserByUserName(loginRequest.getUserName());
    if (userDTO == null) {
        return ResponseEntity.status(401).body("User not found");
    }
    // Replace this with proper password hashing & verification
    if (!userDTO.getPassWord().equals(loginRequest.getPassWord())) {
        return ResponseEntity.status(401).body("Invalid password");
    }
    // Login successful
    // You can return user info or JWT token here
    return ResponseEntity.ok(userDTO);
}

}