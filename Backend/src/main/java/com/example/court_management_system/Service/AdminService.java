package com.example.court_management_system.Service;

import com.example.court_management_system.Entity.AdminEntity;
import com.example.court_management_system.Repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import lombok.*;
@Data
@Service
@RequiredArgsConstructor
@Builder
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminEntity createAdmin(AdminEntity admin) {
        // Store password as plain text (not secure!)
        return adminRepository.save(admin);
    }

    public Optional<AdminEntity> login(String username, String rawPassword) {
        Optional<AdminEntity> admin = adminRepository.findByUsername(username);
        if (admin.isPresent() && rawPassword.equals(admin.get().getPassword())) {
            return admin;
        } else {
            return Optional.empty();
        }
    }
}
