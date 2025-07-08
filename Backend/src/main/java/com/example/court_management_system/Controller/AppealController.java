package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.AppealRequestDTO;
import com.example.court_management_system.DTO.AppealResponseDTO;
import com.example.court_management_system.Service.AppealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appeals")
@RequiredArgsConstructor
public class AppealController {

    private final AppealService appealService;

    @PostMapping("/submit")
    public ResponseEntity<AppealResponseDTO> submitAppeal(@RequestBody AppealRequestDTO request) {
        return ResponseEntity.ok(appealService.submitAppeal(request));
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<AppealResponseDTO>> getAppealsByUser(@RequestParam String userName) {
        return ResponseEntity.ok(appealService.getAppealsByUser(userName));
    }

    @GetMapping("/by-prosecutor")
    public ResponseEntity<List<AppealResponseDTO>> getAppealsForProsecutor(@RequestParam String prosecutorUsername) {
        return ResponseEntity.ok(appealService.getAppealsForProsecutor(prosecutorUsername));
    }
}
