package com.example.court_management_system.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CaseForwardingDTO {
    private Long caseId;
    private String details;
    private String evidenceSummary;
    private String witnesses;
    private List<String> caseFileNames;
    private List<String> evidenceFileNames;
}

