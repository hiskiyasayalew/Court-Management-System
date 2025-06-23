package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.PoliceDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Service.PoliceService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/police")
@RequiredArgsConstructor
@CrossOrigin
public class PoliceController {

    private final PoliceService policeService;

    @GetMapping("/cases")
    public List<caseDTO> getAllSubmittedCases() {
        return policeService.getAllSubmittedCases();
    }

    @PostMapping("/register")
public ResponseEntity<?> registerPolice(@RequestBody PoliceDTO policeDTO) {
    try {
        return ResponseEntity.ok(policeService.registerPolice(policeDTO));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@PostMapping("/login")
public ResponseEntity<?> loginPolice(@RequestBody PoliceDTO loginDTO) {
    try {
        return ResponseEntity.ok(policeService.loginPolice(loginDTO.getUsername(), loginDTO.getPassword()));
    } catch (RuntimeException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
}

    @PostMapping("/approve/{caseId}")
    public caseDTO approveCase(@PathVariable Long caseId, @RequestParam String description) {
        return policeService.approveCase(caseId, description);
    }

    @PostMapping("/reject/{caseId}")
public ResponseEntity<?> rejectCase(@PathVariable Long caseId, @RequestParam String reason) {
    try {
        caseDTO updatedCase = policeService.rejectCase(caseId, reason);
        return ResponseEntity.ok(updatedCase);
    } catch (Exception e) {
        e.printStackTrace(); // Log the error stack trace
        return ResponseEntity.status(500).body("Error: " + e.getMessage());
    }
}


    @PostMapping("/forward/{caseId}")
    public caseDTO forwardToProsecutor(@PathVariable Long caseId, @RequestParam String note) {
        return policeService.forwardToProsecutor(caseId, note);
    }
    
}
