package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.PoliceEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PoliceRepository extends JpaRepository<PoliceEntity, Long> {
    PoliceEntity findByUsername(String username);
    default List<PoliceEntity> findAllApplications() {
        return findAll();
    }
}
