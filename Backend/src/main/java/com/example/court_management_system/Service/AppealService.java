package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.AppealRequestDTO;
import com.example.court_management_system.DTO.AppealResponseDTO;
import com.example.court_management_system.Entity.AppealEntity;
import com.example.court_management_system.Entity.ProsecutorEntity;
import com.example.court_management_system.Repository.AppealRepository;
import com.example.court_management_system.Repository.ProsecutorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppealService {

    private final AppealRepository appealRepository;
    private final ProsecutorRepository prosecutorRepository;

    public AppealResponseDTO submitAppeal(AppealRequestDTO requestDTO) {
        List<ProsecutorEntity> prosecutors = prosecutorRepository.findAll();
        if (prosecutors.isEmpty()) {
            throw new RuntimeException("No prosecutors available");
        }

        ProsecutorEntity selectedProsecutor = prosecutors.get(new Random().nextInt(prosecutors.size()));

        AppealEntity appeal = AppealEntity.builder()
                .caseId(requestDTO.getCaseId())
                .userName(requestDTO.getUserName())
                .reason(requestDTO.getReason())
                .assignedProsecutor(selectedProsecutor.getName())
                .status("Pending")
                .submittedAt(LocalDateTime.now())
                .build();

        return mapToDTO(appealRepository.save(appeal));
    }

    public List<AppealResponseDTO> getAppealsByUser(String userName) {
        return appealRepository.findByUserName(userName)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppealResponseDTO> getAppealsForProsecutor(String prosecutorUsername) {
        return appealRepository.findAll().stream()
                .filter(appeal -> appeal.getCaseEntity() != null &&
                        appeal.getCaseEntity().getProsecutor() != null &&
                        prosecutorUsername.equals(appeal.getCaseEntity().getProsecutor().getUsername()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AppealResponseDTO mapToDTO(AppealEntity entity) {
        return AppealResponseDTO.builder()
                .id(entity.getId())
                .caseId(entity.getCaseId())
                .userName(entity.getUserName())
                .reason(entity.getReason())
                .assignedProsecutor(entity.getAssignedProsecutor())
                .status(entity.getStatus())
                .submittedAt(entity.getSubmittedAt())
                .build();
    }
}
