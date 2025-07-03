package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.CaseApprovalRequest;
import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Repository.CaseForwardingRepository;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Service.JudgeService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/judge")
@CrossOrigin
@RequiredArgsConstructor
public class JudgeController {

    private final JudgeService judgeService;
    private final CaseForwardingRepository repository;

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
        public ResponseEntity<String> approveCase(@RequestBody CaseApprovalRequest approvalRequest) {
            // Here you can save to database or perform business logic
            
            System.out.println("✅ Case Approved: " + approvalRequest.getCaseId());
            System.out.println("📅 Hearing Date: " + approvalRequest.getHearingDate());
            System.out.println("👨‍⚖️ Judges: " + approvalRequest.getAssignedJudges());
            System.out.println("🏛 Court: " + approvalRequest.getAssignedCourt());

            return ResponseEntity.ok("Case " + approvalRequest.getCaseId() + " approved successfully");
        }
}
