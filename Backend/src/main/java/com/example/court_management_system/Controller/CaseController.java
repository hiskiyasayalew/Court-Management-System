package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.VerdictEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Service.CaseService;
import com.example.court_management_system.Service.VerdictService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@CrossOrigin
public class CaseController {

    private final CaseService caseService;
    private final VerdictService verdictService;

    @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
    public caseDTO submitCase(
            @RequestPart("caseData") String caseData,
            @RequestPart("files") List<MultipartFile> files
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            caseDTO dto = mapper.readValue(caseData, caseDTO.class);

            File uploadDir = new File(System.getProperty("user.dir"), "uploads");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            List<String> fileNames = new ArrayList<>();
            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();
                if (fileName != null && !fileName.isBlank()) {
                    File destination = new File(uploadDir, fileName);
                    file.transferTo(destination);
                    fileNames.add(fileName);
                }
            }

            dto.setIdCardUploadName(fileNames.size() > 0 ? fileNames.get(0) : null);
            dto.setAdditionalFileNames(fileNames.size() > 1 ? fileNames.subList(1, fileNames.size()) : List.of());

            return caseService.submitCase(dto);

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to parse or save case", e);
        }
    }

    @GetMapping("/get-all")
    public List<caseDTO> getAllCases() {
        return caseService.getAllCases();
    }

    @GetMapping("/{id}")
    public caseDTO getCaseById(@PathVariable Long id) {
        return caseService.getCaseById(id);
    }

    @GetMapping("/by-phone")
    public List<caseDTO> getCasesByPhone(@RequestParam String phone) {
        return caseService.getCasesByPhone(phone);
    }

    @PatchMapping("/{id}")
    public caseDTO updateStatusWithDescription(
            @PathVariable Long id,
            @RequestParam caseStatus newStatus,
            @RequestParam String policeDescription) {
        return caseService.updateStatusWithDescription(id, newStatus, policeDescription);
    }

    @GetMapping("/by-user")
    public List<caseDTO> getCasesByUser(@RequestParam String userName) {
        return caseService.getCasesByUserName(userName);
    }

    @DeleteMapping("/{id}")
    public void deleteCaseById(@PathVariable Long id) {
        caseService.deleteCaseById(id);
    }

    @DeleteMapping("/clear")
    public void clearUserCases(@RequestParam String userName) {
        caseService.clearCasesByUserName(userName);
    }

    // ✅ NEW: Get Verdict for a Case
    @GetMapping("/verdict")
    public VerdictEntity getVerdictForCase(@RequestParam Long caseId) {
        return verdictService.findByCaseId(caseId);
    }

    
}
