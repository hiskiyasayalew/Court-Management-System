package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.Entity.ProsecutorEntity;
import com.example.court_management_system.Repository.ProsecutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProsecutorService {

    private final ProsecutorRepository prosecutorRepository;

    public ProsecutorDTO registerProsecutor(ProsecutorDTO dto) {
        if (prosecutorRepository.findByUsername(dto.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        ProsecutorEntity entity = ProsecutorEntity.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .build();

        return toDTO(prosecutorRepository.save(entity));
    }

    public ProsecutorDTO login(String username, String password) {
        ProsecutorEntity entity = prosecutorRepository.findByUsername(username);
        if (entity == null || !entity.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }
        return toDTO(entity);
    }

    public List<ProsecutorDTO> getAllProsecutors() {
        return prosecutorRepository.findAll().stream()
                .map(p -> new ProsecutorDTO(
                        p.getId(),
                        p.getName(),
                        p.getEmail(),
                        p.getPhoneNumber(),
                        p.getUsername(),
                        null // Don't return password
                ))
                .collect(Collectors.toList());
    }

    private ProsecutorDTO toDTO(ProsecutorEntity entity) {
        ProsecutorDTO dto = new ProsecutorDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setUsername(entity.getUsername());
        dto.setPassword(entity.getPassword());
        return dto;
    }
}
