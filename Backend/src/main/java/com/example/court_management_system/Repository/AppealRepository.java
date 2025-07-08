package com.example.court_management_system.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.court_management_system.Entity.AppealEntity;

@Repository
public interface AppealRepository extends JpaRepository<AppealEntity, Long> {
    List<AppealEntity> findByUserName(String userName);
    List<AppealEntity> findByAssignedProsecutor(String assignedProsecutor);

}
