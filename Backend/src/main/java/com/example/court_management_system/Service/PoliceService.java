package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.PoliceDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.PoliceEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.PoliceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PoliceService {

    private final PoliceRepository policeRepository;
    private final CaseRepository caseRepository;

    public List<caseDTO> getAllSubmittedCases() {
        return caseRepository.findAll().stream()
                .filter(c -> c.getStatus() == caseStatus.SUBMITTED_TO_PROCESS)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public caseDTO approveCase(Long caseId, String description) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        caseEntity.setStatus(caseStatus.UNDER_INVESTIGATION);
        caseEntity.setCaseDescription(caseEntity.getCaseDescription() + "\n\n[Police Note]: " + description);
        return toDTO(caseRepository.save(caseEntity));
    }

    public caseDTO rejectCase(Long caseId, String reason) {
    CaseEntity caseEntity = caseRepository.findById(caseId)
        .orElseThrow(() -> new RuntimeException("Case not found with id: " + caseId));

    caseEntity.setStatus(caseStatus.REJECTED);

    String existingDesc = caseEntity.getCaseDescription() != null ? caseEntity.getCaseDescription() : "";
    String appendedDesc = existingDesc + "\n\n[Police Rejection Reason]: " + reason;
    caseEntity.setCaseDescription(appendedDesc);

    CaseEntity updatedCase = caseRepository.save(caseEntity);
    return toDTO(updatedCase);
}


    public caseDTO forwardToProsecutor(Long caseId, String note) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        caseEntity.setStatus(caseStatus.SENT_TO_PROSECUTOR); // You may need to add this status if missing
        caseEntity.setCaseDescription(caseEntity.getCaseDescription() + "\n\n[Police Forward Note]: " + note);
        return toDTO(caseRepository.save(caseEntity));
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
            .userName(entity.getUser() != null ? entity.getUser().getUserName() : null) // ← fix here
            .build();
}


    public PoliceDTO registerPolice(PoliceDTO dto) {
    if (policeRepository.findByUsername(dto.getUsername()) != null) {
        throw new RuntimeException("Username already taken");
    }

    PoliceEntity police = PoliceEntity.builder()
            .officerName(dto.getOfficerName())
            .position(dto.getPosition())
            .email(dto.getEmail())
            .phoneNumber(dto.getPhoneNumber())
            .username(dto.getUsername())
            .password(dto.getPassword())
            .build();

    return toDTO(policeRepository.save(police));
}

public PoliceDTO loginPolice(String username, String password) {
    PoliceEntity police = policeRepository.findByUsername(username);
    if (police == null || !police.getPassword().equals(password)) {
        throw new RuntimeException("Invalid username or password");
    }
    return toDTO(police);
}

private PoliceDTO toDTO(PoliceEntity entity) {
    PoliceDTO dto = new PoliceDTO();
    dto.setId(entity.getId());
    dto.setOfficerName(entity.getOfficerName());
    dto.setPosition(entity.getPosition());
    dto.setEmail(entity.getEmail());
    dto.setPhoneNumber(entity.getPhoneNumber());
    dto.setUsername(entity.getUsername());
    dto.setPassword(entity.getPassword());
    return dto;
}
}
