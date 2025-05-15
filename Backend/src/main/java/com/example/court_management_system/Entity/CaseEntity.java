package com.example.court_management_system.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "case")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @ManyToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_name", nullable = false)
    private UserEntity user;
    
}
