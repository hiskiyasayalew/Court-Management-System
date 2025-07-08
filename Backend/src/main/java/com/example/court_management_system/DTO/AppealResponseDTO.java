package com.example.court_management_system.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppealResponseDTO {
    private Long id;
    private Long caseId;
    private String userName;
    private String reason;
    private String assignedProsecutor;
    private String status;
    private LocalDateTime submittedAt;
}
