package com.example.court_management_system.DTO;

import lombok.Data;

@Data
public class VerdictDTO {
    private Long caseId;
    private Long judgeId;
    private String verdictText;
    // Optional: private MultipartFile file;  // If you want file upload
}
