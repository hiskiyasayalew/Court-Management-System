package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.AppealRequestDTO;
import com.example.court_management_system.DTO.AppealResponseDTO;
import com.example.court_management_system.Entity.AppealEntity;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.ProsecutorEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Repository.AppealRepository;
import com.example.court_management_system.Repository.CaseRepository;
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
    private final CaseRepository caseRepository;

    /** ✅ Submit appeal + randomly assign a prosecutor (username not just name) */
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
                // ✅ store username instead of name → consistent
                .assignedProsecutor(selectedProsecutor.getUsername())
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

    /** ✅ Safe filtering: avoid NullPointer when case or prosecutor is null */
    public List<AppealResponseDTO> getAppealsForProsecutor(String prosecutorUsername) {
        return appealRepository.findAll().stream()
                .filter(appeal -> {
                    CaseEntity caseEntity = appeal.getCaseEntity();
                    return caseEntity != null &&
                           caseEntity.getProsecutor() != null &&
                           prosecutorUsername.equals(caseEntity.getProsecutor().getUsername());
                })
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

    /** ✅ Approve appeal → assign linked prosecutor to the case & update status */
    public AppealResponseDTO approveAppeal(Long appealId, String description) {
        AppealEntity appeal = appealRepository.findById(appealId)
            .orElseThrow(() -> new RuntimeException("Appeal not found"));

        CaseEntity caseEntity = appeal.getCaseEntity();
        if (caseEntity != null) {
            caseEntity.setStatus(caseStatus.SENT_TO_PROSECUTOR);

            // ✅ Find prosecutor by username from appeal
            if (appeal.getAssignedProsecutor() != null) {
                ProsecutorEntity assignedProsecutor =
                        prosecutorRepository.findByUsername(appeal.getAssignedProsecutor());
                if (assignedProsecutor != null) {
                    caseEntity.setProsecutor(assignedProsecutor);
                }
            }

            caseRepository.save(caseEntity);
        }

        appeal.setStatus("Approved");
        appealRepository.save(appeal);

        return mapToDTO(appeal);
    }

    public AppealResponseDTO rejectAppeal(Long appealId, String reason) {
        AppealEntity appeal = appealRepository.findById(appealId)
            .orElseThrow(() -> new RuntimeException("Appeal not found"));

        appeal.setStatus("Rejected");
        appealRepository.save(appeal);

        return mapToDTO(appeal);
    }
}
