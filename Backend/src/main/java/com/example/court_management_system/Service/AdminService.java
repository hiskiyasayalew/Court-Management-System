package com.example.court_management_system.Service;

import com.example.court_management_system.Entity.AdminEntity;
import com.example.court_management_system.Repository.AdminRepository;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import lombok.*;
@Data
@Service
@RequiredArgsConstructor
@Builder
public class AdminService {
    private final AdminRepository adminRepository;
    private final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public AdminEntity createAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }


    public Optional<String> login(String username, String rawPassword) {
        Optional<AdminEntity> admin = adminRepository.findByUsername(username);

        if (admin.isPresent() && rawPassword.equals(admin.get().getPassword())) {
            // ✅ Generate JWT token with secure HS256 key
            String token = Jwts.builder()
                    .setSubject(admin.get().getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                    .signWith(SECRET_KEY)
                    .compact();
            return Optional.of(token);
        }
        return Optional.empty();
    }
}
