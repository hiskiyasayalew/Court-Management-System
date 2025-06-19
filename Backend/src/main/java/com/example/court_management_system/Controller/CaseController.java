package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Service.CaseService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@CrossOrigin
public class CaseController {

    private final CaseService caseService;

   @PostMapping(value = "/submit", consumes = {"multipart/form-data"})
public caseDTO submitCase(
        @RequestPart("caseData") String caseData,
        @RequestPart("files") List<MultipartFile> files
) {
    try {
        // Convert caseData (JSON string) to DTO
        ObjectMapper mapper = new ObjectMapper();
        caseDTO dto = mapper.readValue(caseData, caseDTO.class);

        // Handle files (store or just names)
        List<String> fileNames = new ArrayList<>();
        for (MultipartFile file : files) {
            fileNames.add(file.getOriginalFilename());
            // You can also save the file to disk or cloud here
        }

        // Assign file names to dto
        dto.setIdCardUploadName(fileNames.size() > 0 ? fileNames.get(0) : null); // assume 1st is ID card
        dto.setAdditionalFileNames(fileNames.size() > 1 ? fileNames.subList(1, fileNames.size()) : List.of());

        return caseService.submitCase(dto);

    } catch (IOException e) {
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
    public caseDTO updateStatus(@PathVariable Long id, @RequestParam caseStatus status) {
        return caseService.updateStatus(id, status);
    }
        @GetMapping("/by-user")
    public List<caseDTO> getCasesByUser(@RequestParam String userName) {
        return caseService.getCasesByUserName(userName);
    }
}
