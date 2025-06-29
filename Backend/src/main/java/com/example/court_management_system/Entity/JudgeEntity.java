package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;

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
}
