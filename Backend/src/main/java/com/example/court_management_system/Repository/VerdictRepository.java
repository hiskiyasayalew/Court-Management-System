package com.example.court_management_system.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.court_management_system.Entity.VerdictEntity;

public interface VerdictRepository extends JpaRepository<VerdictEntity, Long> {
    List<VerdictEntity> findByJudgeId(Long judgeId);
}