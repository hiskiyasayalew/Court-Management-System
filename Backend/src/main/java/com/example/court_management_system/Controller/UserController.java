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
        if (message.contains("exists")) {
            return ResponseEntity.badRequest().body(message);
        }
        return ResponseEntity.ok(message);
    }

    @GetMapping("/login/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        UserDTO userDTO = userService.getUserByUserName(username);
        if (userDTO == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(userDTO);
    }

   @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody UserDTO loginRequest) {
    UserDTO userDTO = userService.getUserByUserName(loginRequest.getUserName());

    if (userDTO == null) {
        return ResponseEntity.status(401).body("User not found");
    }

    // Debug print
    System.out.println("Stored password: " + userDTO.getPassword());
    System.out.println("Received password: " + loginRequest.getPassword());

    if (loginRequest.getPassword() == null || userDTO.getPassword() == null ||
        !loginRequest.getPassword().equals(userDTO.getPassword())) {
        return ResponseEntity.status(401).body("Invalid password");
    }

    return ResponseEntity.ok(userDTO);
}


}
