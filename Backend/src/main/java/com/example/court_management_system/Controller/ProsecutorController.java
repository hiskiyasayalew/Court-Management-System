package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.JudgeRepository;
import com.example.court_management_system.Service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/send-to-judge")
    public ResponseEntity<?> sendToJudge(
            @RequestParam Long caseId,
            @RequestParam Long judgeId,
            @RequestParam String court,
            @RequestParam Long prosecutorId
            // 👉 plus: handle file uploads etc. if needed
    ) {
        // 1️⃣ Find the case
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        // 2️⃣ Find the judge
        JudgeEntity judge = judgeRepository.findById(judgeId)
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        // 3️⃣ Save judge to case
        caseEntity.setJudge(judge);

        // 4️⃣ Save court to case
        caseEntity.setCourt(court);

        // 5️⃣ Save
        caseRepository.save(caseEntity);

        return ResponseEntity.ok("✅ Sent to judge successfully!");
    }
}
