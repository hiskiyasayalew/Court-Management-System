package com.example.court_management_system.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "judges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class JudgeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String username;

    private String password;

    private String email;

    private String status; // ACTIVE, INACTIVE, etc.
     private String phoneNumber;
     
    private String reason;           // <-- MUST exist
   private String education;        // <-- MUST exist
   private String workExperience;   // <-- MUST exist
   private String additionalInfo;  
   
     @ElementCollection
    private List<String> educationFiles;// <-- MUST exist
}
