package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Service.*;

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
    private final ProsecutorToJudgeFormService formService;
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

  
    @PostMapping("/send-to-judge")
    public ResponseEntity<?> sendToJudge(@ModelAttribute ProsecutorToJudgeFormDTO dto) {
        System.out.println("Received caseId: " + dto.getCaseId());
        System.out.println("Received prosecutorId: " + dto.getProsecutorId());
        System.out.println("Received judgeId: " + dto.getJudgeId());
        System.out.println("Details: " + dto.getDetails());
        System.out.println("Evidence Summary: " + dto.getEvidenceSummary());
        System.out.println("Witnesses: " + dto.getWitnesses());
        System.out.println("caseFiles count: " + (dto.getCaseFiles() != null ? dto.getCaseFiles().size() : 0));
        System.out.println("evidenceFiles count: " + (dto.getEvidenceFiles() != null ? dto.getEvidenceFiles().size() : 0));

        try {
            return ResponseEntity.ok(formService.submitFormToJudge(dto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }

}
}