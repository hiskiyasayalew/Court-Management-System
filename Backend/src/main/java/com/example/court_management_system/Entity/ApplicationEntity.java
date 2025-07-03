package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "applications")
public class ApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
     private String phoneNumber; 
    private String address;
    private String role;
    private String reason;
    private String education;
    private String workExperience;
    private String additionalInfo;

    @ElementCollection
    private List<String> educationFiles; // Store file paths or URLs
}
