package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.CaseEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseRepository extends JpaRepository<CaseEntity, Long> {
    List<CaseEntity> findByPhone(String phone);
}
