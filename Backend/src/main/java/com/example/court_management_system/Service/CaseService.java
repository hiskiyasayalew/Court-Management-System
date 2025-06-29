package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.UserEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public caseDTO submitCase(caseDTO dto) {
        UserEntity user = userRepository.findByUserName(dto.getUserName());
        if (user == null) {
            throw new RuntimeException("Invalid user.");
        }

        CaseEntity entity = CaseEntity.builder()
                .fullName(dto.getFullName().trim())
                .email(dto.getEmail().trim())
                .phone(dto.getPhone().trim())
                .dateOfIncident(dto.getDateOfIncident())
                .caseType(dto.getCaseType())
                .caseDescription(dto.getCaseDescription().trim())
                .idCardUploadName(dto.getIdCardUploadName())
                .additionalFileNames(dto.getAdditionalFileNames())
                .agreement(dto.getAgreement())
                .status(caseStatus.SUBMITTED_TO_PROCESS)
                .submittedAt(LocalDateTime.now())
                .user(user)
                .build();

        return toDTO(caseRepository.save(entity));
    }

    public List<caseDTO> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public caseDTO updateStatusWithDescription(Long id, caseStatus newStatus, String policeDescription) {
        CaseEntity caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));

        caseEntity.setStatus(newStatus);

        String updatedDescription = (caseEntity.getCaseDescription() != null ? caseEntity.getCaseDescription() : "")
                + "\n\n[Police Feedback]: " + policeDescription;

        caseEntity.setCaseDescription(updatedDescription);

        return toDTO(caseRepository.save(caseEntity));
    }

    public caseDTO getCaseById(Long id) {
        return toDTO(caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id)));
    }

    public List<caseDTO> getCasesByPhone(String phone) {
        return caseRepository.findAll().stream()
                .filter(c -> phone.equals(c.getPhone()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<caseDTO> getCasesByUserName(String userName) {
        UserEntity user = userRepository.findByUserName(userName);
        if (user == null) return List.of();

        return caseRepository.findAll().stream()
                .filter(c -> c.getUser() != null && c.getUser().getId().equals(user.getId()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private caseDTO toDTO(CaseEntity entity) {
        return caseDTO.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .dateOfIncident(entity.getDateOfIncident())
                .caseType(entity.getCaseType())
                .caseDescription(entity.getCaseDescription())
                .idCardUploadName(entity.getIdCardUploadName())
                .additionalFileNames(entity.getAdditionalFileNames())
                .agreement(entity.getAgreement())
                .status(entity.getStatus())
                .submittedAt(entity.getSubmittedAt())
                .userName(entity.getUser() != null ? entity.getUser().getUserName() : null)
                .build();
    }   

      public List<caseDTO> getCasesForProsecutor(String username) {
        return caseRepository.findAll().stream()
                .filter(c -> c.getProsecutor() != null && username.equals(c.getProsecutor().getUsername()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
        // ✅ Delete single case by ID
    public void deleteCaseById(Long id) {
        if (!caseRepository.existsById(id)) {
            throw new RuntimeException("Case not found with ID: " + id);
        }
        caseRepository.deleteById(id);
    }

    // ✅ Delete all cases for a specific user
    public void clearCasesByUserName(String userName) {
        UserEntity user = userRepository.findByUserName(userName);
        if (user == null) {
            throw new RuntimeException("User not found with username: " + userName);
        }

        List<CaseEntity> userCases = caseRepository.findAll().stream()
                .filter(c -> c.getUser() != null && c.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());

        caseRepository.deleteAll(userCases);
    }
    @Transactional
    public String prosecutorApproveCase(Long caseId, String description) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with id " + caseId));

        caseEntity.setStatus(caseStatus.OPEN);  // set status to OPEN
        caseEntity.setProsecutorReview(description);  // set prosecutor review/comment

        caseRepository.save(caseEntity);

        return "Case approved and status set to OPEN.";
    }

    @Transactional
    public String prosecutorRejectCase(Long caseId, String reason) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with id " + caseId));

        caseEntity.setStatus(caseStatus.REJECTED);  // set status to REJECTED
        caseEntity.setProsecutorReview(reason);  // set prosecutor review/comment

        caseRepository.save(caseEntity);

        return "Case rejected and status set to REJECTED.";
    }
}
