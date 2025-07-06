package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.UserEntity;
import com.example.court_management_system.Entity.caseStatus;

import jakarta.persistence.criteria.CriteriaBuilder.Case;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseRepository extends JpaRepository<CaseEntity, Long> {

    // ✅ Find all cases by phone number
    List<CaseEntity> findByPhone(String phone);

    // ✅ Find all cases submitted by a specific user   
    List<CaseEntity> findByUser(UserEntity user);

    // ✅ Delete all cases submitted by a specific user
    void deleteAllByUser(UserEntity user);
    
    List<CaseEntity> findByUserUserName(String userName);
    
    List<CaseEntity> findByStatusAndJudge_Id(caseStatus status, Long judgeId);
    
    @Query("SELECT c FROM CaseEntity c WHERE c.prosecutor.username = :username AND (c.status = com.example.court_management_system.Entity.caseStatus.SUBMITTED_TO_PROCESS OR c.status = com.example.court_management_system.Entity.caseStatus.SENT_TO_PROSECUTOR)")
    List<CaseEntity> findProsecutorCasesIncludingAppeals(@Param("username") String username);



}
