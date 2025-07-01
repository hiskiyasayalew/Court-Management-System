package com.example.court_management_system.DTO;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProsecutorToJudgeFormDTO {
    private Long caseId;
    private Long prosecutorId;
    private Long judgeId;
    private String courtName;
    private String details;
    private String evidenceSummary;
    private String witnesses;
    private List<MultipartFile> caseFiles;
    private List<MultipartFile> evidenceFiles;
}
