package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.PoliceDTO;
import com.example.court_management_system.DTO.caseDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.PoliceEntity;
import com.example.court_management_system.Entity.ProsecutorEntity;
import com.example.court_management_system.Entity.caseStatus;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.PoliceRepository;
import com.example.court_management_system.Repository.ProsecutorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PoliceService {

    private final PoliceRepository policeRepository;
    private final CaseRepository caseRepository;
    private final ProsecutorRepository prosecutorRepository;

    // ✅ Fetch all cases with status SUBMITTED_TO_PROCESS
    public List<caseDTO> getAllSubmittedCases() {
        return caseRepository.findAll().stream()
                .filter(c -> c.getStatus() == caseStatus.SUBMITTED_TO_PROCESS)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Approve case and mark it as UNDER_INVESTIGATION with police feedback
    public caseDTO approveCase(Long caseId, String description) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + caseId));

        caseEntity.setStatus(caseStatus.UNDER_INVESTIGATION);

        String existingDesc = caseEntity.getCaseDescription() != null ? caseEntity.getCaseDescription() : "";
        String updatedDesc = existingDesc + "\n\n[Police Note]: " + description;
        caseEntity.setCaseDescription(updatedDesc);

        return toDTO(caseRepository.save(caseEntity));
    }

    // ✅ Reject case with reason and mark it as REJECTED
    public caseDTO rejectCase(Long caseId, String reason) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + caseId));

        String existingDesc = caseEntity.getCaseDescription() != null ? caseEntity.getCaseDescription() : "";
        String updatedDesc = existingDesc + "\n\n[Police Rejection Reason]: " + reason;
        caseEntity.setCaseDescription(updatedDesc);
        caseEntity.setStatus(caseStatus.REJECTED);

        return toDTO(caseRepository.save(caseEntity));
    }

    // ✅ Forward case to prosecutor, attach prosecutor, evidence, witness and uploaded files
    public caseDTO sendToProsecutor(Long caseId, Long prosecutorId, String details, String evidence, String witnesses, List<String> uploadedFiles) {
        CaseEntity caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + caseId));

        ProsecutorEntity prosecutor = prosecutorRepository.findById(prosecutorId)
                .orElseThrow(() -> new RuntimeException("Prosecutor not found with ID: " + prosecutorId));

        caseEntity.setProsecutor(prosecutor);
        caseEntity.setStatus(caseStatus.SENT_TO_PROSECUTOR);

        String desc = caseEntity.getCaseDescription() != null ? caseEntity.getCaseDescription() : "";
        String newDesc = desc +
                "\n\n[Police Details]: " + details +
                "\n[Evidence]: " + evidence +
                "\n[Witnesses]: " + witnesses;
        caseEntity.setCaseDescription(newDesc);

        if (uploadedFiles != null && !uploadedFiles.isEmpty()) {
            caseEntity.setAdditionalFileNames(uploadedFiles);
        }

        return toDTO(caseRepository.save(caseEntity));
    }

    // ✅ Get only approved (forwarded) cases   
    public List<caseDTO> getApprovedCases() {
        return caseRepository.findAll().stream()
                .filter(c -> c.getStatus() == caseStatus.SENT_TO_PROSECUTOR)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Get only rejected cases
    public List<caseDTO> getRejectedCases() {
        return caseRepository.findAll().stream()
                .filter(c -> c.getStatus() == caseStatus.REJECTED)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ✅ Register police (username must be unique)
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

    // ✅ Login police
    public PoliceDTO loginPolice(String username, String password) {
        PoliceEntity police = policeRepository.findByUsername(username);
        if (police == null || !police.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }
        return toDTO(police);
    }

    // ✅ Convert PoliceEntity to DTO
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

    // ✅ Convert CaseEntity to DTO
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
            .prosecutorName(entity.getProsecutor() != null ? entity.getProsecutor().getUsername() : null)  // ✅ NEW
            .build();
}
    
    
    
            public void deletePoliceById(Long id) {
            policeRepository.deleteById(id);
        }

        public PoliceDTO updatePolice(PoliceDTO dto) {
            PoliceEntity existing = policeRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Police not found"));

            existing.setOfficerName(dto.getOfficerName());
            existing.setPosition(dto.getPosition());
            existing.setPhoneNumber(dto.getPhoneNumber());
            existing.setEmail(dto.getEmail());
            existing.setUsername(dto.getUsername());
            existing.setPassword(dto.getPassword());

            return toDTO(policeRepository.save(existing));
        }
        public List<PoliceDTO> getAllPolice() {
                return policeRepository.findAll().stream()
                    .map(police -> {
                        PoliceDTO dto = new PoliceDTO();
                        dto.setId(police.getId());
                        dto.setOfficerName(police.getOfficerName());
                        dto.setPosition(police.getPosition());
                        dto.setEmail(police.getEmail());
                        dto.setPhoneNumber(police.getPhoneNumber());
                        dto.setUsername(police.getUsername());
                        dto.setPassword(null); // Don't expose password
                        return dto;
                    })
                    .collect(Collectors.toList());
            }


    
}
