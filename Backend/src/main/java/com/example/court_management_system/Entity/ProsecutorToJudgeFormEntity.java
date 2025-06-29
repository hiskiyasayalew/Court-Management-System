package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "prosecutor_to_judge_forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProsecutorToJudgeFormEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "case_id")
    private CaseEntity caseEntity;

    @ManyToOne
    @JoinColumn(name = "prosecutor_id")
    private ProsecutorEntity prosecutor;

    @ManyToOne
    @JoinColumn(name = "judge_id")
    private JudgeEntity judge;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "TEXT")
    private String evidenceSummary;

    @Column(columnDefinition = "TEXT")
    private String witnesses;

    // store filenames for uploaded files (you can store as JSON string or a serialized list)
    @ElementCollection
    private List<String> caseFiles;

    @ElementCollection
    private List<String> evidenceFiles;

    private LocalDateTime submittedAt;
}
