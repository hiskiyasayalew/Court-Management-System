package com.example.court_management_system.Controller;


import com.example.court_management_system.DTO.AppealRequestDTO;
import com.example.court_management_system.Entity.AppealEntity;
import com.example.court_management_system.Entity.ProsecutorEntity;
import com.example.court_management_system.Repository.AppealRepository;
import com.example.court_management_system.Repository.ProsecutorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/appeals")
public class AppealController {

    @Autowired
    private AppealRepository appealRepo;

    @Autowired
    private ProsecutorRepository prosecutorRepo;

    @PostMapping("/submit")
    public ResponseEntity<AppealEntity> submitAppeal(@RequestBody AppealRequestDTO appealRequest) {
        List<ProsecutorEntity> prosecutors = prosecutorRepo.findAll();
        if (prosecutors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        ProsecutorEntity randomProsecutor = prosecutors.get(new Random().nextInt(prosecutors.size()));

        AppealEntity appeal = AppealEntity.builder()
                .caseId(appealRequest.getCaseId())
                .userName(appealRequest.getUserName())
                .reason(appealRequest.getReason())
                .assignedProsecutor(randomProsecutor.getName())
                .status("Pending")
                .submittedAt(LocalDateTime.now())
                .build();

        AppealEntity savedAppeal = appealRepo.save(appeal);
        return ResponseEntity.ok(savedAppeal);
    }

    @GetMapping("/by-user")
    public ResponseEntity<List<AppealEntity>> getAppealsByUser(@RequestParam String userName) {
        return ResponseEntity.ok(appealRepo.findByUserName(userName));
    }
}
