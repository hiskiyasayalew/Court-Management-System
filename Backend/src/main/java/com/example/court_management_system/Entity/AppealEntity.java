package com.example.court_management_system.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class AppealEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;
    private String userName;
    private String reason;
    private String assignedProsecutor;
    private String status = "Pending";
    private LocalDateTime submittedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "caseId", referencedColumnName = "id", insertable = false, updatable = false)
    private CaseEntity caseEntity; // 👈 this is now linked

}

