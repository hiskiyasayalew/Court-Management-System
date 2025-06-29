package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.ProsecutorToJudgeFormEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProsecutorToJudgeFormRepository extends JpaRepository<ProsecutorToJudgeFormEntity, Long> {
}
