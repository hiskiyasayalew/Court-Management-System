package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.CaseForwarding;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseForwardingRepository extends JpaRepository<CaseForwarding, Long> {
   List<CaseForwarding> findByJudgeId(Long judgeId);

}
