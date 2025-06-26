package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.ProsecutorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProsecutorRepository extends JpaRepository<ProsecutorEntity, Long> {
    ProsecutorEntity findByUsername(String username);
}
