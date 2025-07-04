package com.example.court_management_system.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class JudgeApprovalDTO {
    private Long caseId;
    private LocalDateTime hearingDate;
    private List<String> assignedJudges;
    private String assignedCourt;
}
