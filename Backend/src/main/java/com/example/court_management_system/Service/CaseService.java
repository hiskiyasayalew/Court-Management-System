package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;

    public caseDTO submitCase(caseDTO dto) {
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
                .build();

        return toDTO(caseRepository.save(entity));
    }

    public List<caseDTO> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public caseDTO updateStatus(Long id, caseStatus newStatus) {
        CaseEntity caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));
        caseEntity.setStatus(newStatus);
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
                .build();
    }
}
