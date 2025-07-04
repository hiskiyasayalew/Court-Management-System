package com.example.court_management_system.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.court_management_system.Entity.JudgeDecisionEntity;

public interface JudgeDecisionRepository extends JpaRepository<JudgeDecisionEntity, Long> {
    List<JudgeDecisionEntity> findByCaseId(Long caseId);
}