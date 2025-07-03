package com.example.court_management_system.DTO;

import com.example.court_management_system.Entity.caseStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class caseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String dateOfIncident;
    private String caseType;
    private String caseDescription;
    private String idCardUploadName;
    private List<String> additionalFileNames;
    private String agreement;
    private caseStatus status;
    private LocalDateTime submittedAt;
    private String userName;
    private Long prosecutorId;
    private String prosecutorName;
    private String prosecutorReview;   // <-- Add this to show prosecutor's message
    private JudgeDTO judge;            // <-- Nested DTO for judge details
    private String court;       
           // <-- Court info as string

    // JudgeDTO nested static class for judge info
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JudgeDTO {
        private Long id;
        private String username;
        private String name; 
    }
}
