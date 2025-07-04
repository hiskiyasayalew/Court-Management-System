package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.JudgeRepository;
import com.example.court_management_system.Service.*;

import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
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

    // ✅ Add these two so RequiredArgsConstructor will inject them
    private final CaseRepository caseRepository;
    private final JudgeRepository judgeRepository;

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

    @PostMapping(value = "/send-to-judge", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> sendToJudge(
        @RequestParam Long caseId,
        @RequestParam Long judgeId,
        @RequestParam String court,
        @RequestParam Long prosecutorId,
        @RequestParam String details,
        @RequestParam String evidenceSummary,
        @RequestParam String witnesses,
        @RequestPart(required = false) List<MultipartFile> caseFiles,
        @RequestPart(required = false) List<MultipartFile> evidenceFiles
) {
    try {
        // Build DTO to send to the service layer
        ProsecutorToJudgeFormDTO dto = ProsecutorToJudgeFormDTO.builder()
                .caseId(caseId)
                .judgeId(judgeId)
                .prosecutorId(prosecutorId)
                .courtName(court)
                .details(details)
                .evidenceSummary(evidenceSummary)
                .witnesses(witnesses)
                .caseFiles(caseFiles)
                .evidenceFiles(evidenceFiles)
                .build();

        // Let the service handle everything, including file saving
        caseForwardingService.forwardCase(dto);

        // Update CaseEntity to assign court and judge
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        JudgeEntity judge = judgeRepository.findById(judgeId)
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        caseEntity.setCourt(court);
        caseEntity.setJudge(judge);
        caseRepository.save(caseEntity);

        return ResponseEntity.ok("✅ Sent to judge successfully!");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("❌ Failed to send to judge: " + e.getMessage());
    }
}



}
