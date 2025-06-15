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
    private com.example.court_management_system.Entity.caseStatus status;
    private LocalDateTime submittedAt;
}
