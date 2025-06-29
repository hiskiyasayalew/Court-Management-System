package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.JudgeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JudgeRepository extends JpaRepository<JudgeEntity, Long> {
    JudgeEntity findByUsername(String username);
}
