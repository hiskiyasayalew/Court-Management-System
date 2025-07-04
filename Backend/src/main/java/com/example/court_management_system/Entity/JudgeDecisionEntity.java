package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JudgeDecisionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;
    private LocalDateTime hearingDate;
    private String assignedCourt;

    @ElementCollection
    private List<String> assignedJudges;

    private String status; // Approved or Rejected
}