package com.example.court_management_system.Entity;

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
}
