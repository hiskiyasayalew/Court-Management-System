package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Service.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/prosecutor")
@RequiredArgsConstructor
@CrossOrigin
public class ProsecutorController {

    private final ProsecutorService prosecutorService;
    private final CaseService caseService;
    private final JudgeService judgeService;
    private final CaseForwardingService caseForwardingService;
     // ✅ You forgot to inject this

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

    @GetMapping
    public List<ProsecutorDTO> getAllProsecutors() {
        return prosecutorService.getAllProsecutors();
    }

    @GetMapping("/prosecutor-cases")
    public List<caseDTO> getCasesAssignedToProsecutor(@RequestParam String username) {
        return caseService.getCasesForProsecutor(username);
    }

    @PostMapping("/approve/{caseId}")
    public ResponseEntity<?> approveCase(@PathVariable Long caseId, @RequestParam String description) {
        return ResponseEntity.ok(caseService.prosecutorApproveCase(caseId, description));
    }

    @PostMapping("/reject/{caseId}")
    public ResponseEntity<?> rejectCase(@PathVariable Long caseId, @RequestParam String reason) {
        return ResponseEntity.ok(caseService.prosecutorRejectCase(caseId, reason));
    }

    @GetMapping("/judges")
    public List<JudgeDTO> getAllJudges() {
        return judgeService.getAllJudges();
    }

  
    @PostMapping(value = "/send-to-judge", consumes = {"multipart/form-data"})
    public ResponseEntity<?> sendToJudge(@ModelAttribute ProsecutorToJudgeFormDTO form) {
        try {
            CaseForwarding saved = caseForwardingService.forwardCase(form);
            return ResponseEntity.ok("Case forwarded to judge with ID " + saved.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

}
}