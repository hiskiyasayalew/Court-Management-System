    package com.example.court_management_system.Controller;

    import com.example.court_management_system.DTO.PoliceDTO;
    import com.example.court_management_system.DTO.caseDTO;
    import com.example.court_management_system.Service.PoliceService;
    import lombok.RequiredArgsConstructor;

    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.File;
    import java.util.ArrayList;
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
        

        @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectCase(@PathVariable Long id, @RequestParam String reason) {
        try {
            caseDTO updatedCase = policeService.rejectCase(id, reason);
            return ResponseEntity.ok(updatedCase);
        } catch (Exception e) {
            e.printStackTrace(); // Print full stack trace in backend logs
            return ResponseEntity.status(500).body("Reject failed: " + e.getMessage());
        }
    }

        @GetMapping("/approved-cases")
        public List<caseDTO> getApprovedCases() {
            return policeService.getApprovedCases();
        }

        @GetMapping("/rejected-cases")
        public List<caseDTO> getRejectedCases() {
            return policeService.getRejectedCases();
        }

        @PostMapping(value = "/send-to-prosecutor", consumes = {"multipart/form-data"})
    public ResponseEntity<?> sendToProsecutor(
            @RequestParam Long caseId,
            @RequestParam Long prosecutorId,
            @RequestParam String details,
            @RequestParam String evidence,
            @RequestParam String witnesses,
            @RequestPart(required = false) List<MultipartFile> caseFiles,
            @RequestPart(required = false) List<MultipartFile> evidenceFiles
    ) {
        try {
            List<String> savedFiles = new ArrayList<>();
            File uploadDir = new File(System.getProperty("user.dir"), "uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            if (caseFiles != null) {
                for (MultipartFile file : caseFiles) {
                    File dest = new File(uploadDir, file.getOriginalFilename());
                    file.transferTo(dest);
                    savedFiles.add(file.getOriginalFilename());
                }
            }

            if (evidenceFiles != null) {
                for (MultipartFile file : evidenceFiles) {
                    File dest = new File(uploadDir, file.getOriginalFilename());
                    file.transferTo(dest);
                    savedFiles.add(file.getOriginalFilename());
                }
            }

            caseDTO updated = policeService.sendToProsecutor(caseId, prosecutorId, details, evidence, witnesses, savedFiles);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error forwarding case: " + e.getMessage());
        }
    }
    
    }
