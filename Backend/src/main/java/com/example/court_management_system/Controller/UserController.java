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
}