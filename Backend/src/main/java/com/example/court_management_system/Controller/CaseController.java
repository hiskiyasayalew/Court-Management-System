package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@CrossOrigin
public class CaseController {

    private final CaseService caseService;

    @PostMapping("/submit")
    public caseDTO submitCase(@RequestBody caseDTO caseDTO) {
        return caseService.submitCase(caseDTO);
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
    public caseDTO updateStatus(@PathVariable Long id, @RequestParam caseStatus status) {
        return caseService.updateStatus(id, status);
    }
}
