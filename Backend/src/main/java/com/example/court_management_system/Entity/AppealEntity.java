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
    private String status = "Pending";  // Pending, Accepted, Rejected
    private LocalDateTime submittedAt = LocalDateTime.now();

    // Getters and Setters
}
