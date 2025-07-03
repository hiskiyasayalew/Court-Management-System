package com.example.court_management_system.Repository;

import com.example.court_management_system.Entity.ApplicationEntity;

import lombok.Builder;
import lombok.Data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository

public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
}
