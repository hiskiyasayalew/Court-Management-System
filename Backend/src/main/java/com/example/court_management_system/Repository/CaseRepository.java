package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.UserEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
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

}
