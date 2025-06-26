package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.Service.ProsecutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prosecutor")
@RequiredArgsConstructor
@CrossOrigin
public class ProsecutorController {

    private final ProsecutorService prosecutorService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProsecutor(@RequestBody ProsecutorDTO dto) {
        try {
            return ResponseEntity.ok(prosecutorService.registerProsecutor(dto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ProsecutorDTO dto) {
        try {
            return ResponseEntity.ok(prosecutorService.login(dto.getUsername(), dto.getPassword()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
