package com.example.court_management_system.Entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "police")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PoliceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String officerName;

    private String position;

    private String email;

    private String phoneNumber;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

private String reason;           // <-- MUST exist
   private String education;        // <-- MUST exist
   private String workExperience;   // <-- MUST exist
   private String additionalInfo; 
   
     @ElementCollection
    private List<String> educationFiles;// <-- MUST exist
}
