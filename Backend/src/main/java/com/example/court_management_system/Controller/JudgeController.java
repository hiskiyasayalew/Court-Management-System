package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.CaseApprovalRequest;
import com.example.court_management_system.DTO.JudgeApprovalDTO;
import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.VerdictDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Entity.JudgeDecisionEntity;
import com.example.court_management_system.Repository.CaseForwardingRepository;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Entity.VerdictEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Service.JudgeService;
import com.example.court_management_system.Service.VerdictService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/judge")
@CrossOrigin
@RequiredArgsConstructor
public class JudgeController {

    private final JudgeService judgeService;
    private final CaseForwardingRepository repository;
     private final VerdictService verdictService; 
     @Autowired
    private CaseRepository caseRepo;


    // Admin-only registration endpoint
   @PostMapping("/register")
public ResponseEntity<?> registerJudge(@RequestBody JudgeDTO judgeDTO) {
    try {
        return ResponseEntity.ok(judgeService.registerJudge(judgeDTO));
    } catch (RuntimeException e) {
        e.printStackTrace(); // Show detailed error in logs
        return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
    }
}


    // Judge login (from frontend)
    @PostMapping("/login")
    public ResponseEntity<?> loginJudge(@RequestBody JudgeDTO loginDTO) {
        try {
            JudgeEntity loggedIn = judgeService.loginJudge(loginDTO.getUsername(), loginDTO.getPassword());
            return ResponseEntity.ok(loggedIn);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body("Login failed: " + e.getMessage());
        }
    }
    @GetMapping("/cases")
public List<CaseForwarding> getCasesForJudge(@RequestParam Long judgeId) {
    return repository.findByJudgeId(judgeId);
}
  
        @PostMapping("/approve")
    public JudgeDecisionEntity approveCase(@RequestBody JudgeApprovalDTO dto) {
        return judgeService.approveCase(dto);
    }

    @PostMapping("/reject")
    public void rejectCase(@RequestBody JudgeApprovalDTO dto) {
        judgeService.rejectCase(dto.getCaseId());
    }

    @GetMapping("/decision")
    public List<JudgeDecisionEntity> getCaseSchedule(@RequestParam Long caseId) {
        return judgeService.getUserVisibleSchedule(caseId);
    }

       @PostMapping("/verdict")
    public ResponseEntity<?> submitVerdict(@RequestBody VerdictDTO dto) {
        VerdictEntity v = new VerdictEntity();
        v.setCaseId(dto.getCaseId());
        v.setVerdictText(dto.getVerdictText());
        v.setVerdictDate(LocalDateTime.now());

        verdictService.save(v);

        return ResponseEntity.ok("Verdict saved");
    }

  
}
