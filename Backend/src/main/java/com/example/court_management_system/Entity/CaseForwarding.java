package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "case_forwardings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseForwarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;
    private Long prosecutorId;
    private Long judgeId;

    private String details;
    private String evidenceSummary;
    private String witnesses;

     private String courtName;     // ✅ was missing
    private String status;  

    @ElementCollection
    private List<String> caseFileNames;

    @ElementCollection
    private List<String> evidenceFileNames;
}
