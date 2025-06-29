package com.example.court_management_system.DTO;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProsecutorToJudgeFormDTO {
    private Long caseId;
    private Long prosecutorId;
    private Long judgeId;
    private String details;
    private String evidenceSummary;
    private String witnesses;

    private List<MultipartFile> caseFiles;
    private List<MultipartFile> evidenceFiles;
}