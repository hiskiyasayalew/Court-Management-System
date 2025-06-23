package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.PoliceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PoliceRepository extends JpaRepository<PoliceEntity, Long> {
    PoliceEntity findByUsername(String username);
}
