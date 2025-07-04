package com.example.court_management_system.Entity;

import java.time.LocalDateTime;

import com.example.court_management_system.DTO.JudgeDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "verdicts")
public class VerdictEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;
    private String verdictText;
    private String verdictFileName; // if you store files

    private LocalDateTime verdictDate;

    private Long judgeId;

    // relations if you want
   

    // getters/setters
}
