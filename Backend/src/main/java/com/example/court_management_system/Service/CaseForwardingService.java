package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.CaseForwardingDTO;
import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Repository.CaseForwardingRepository;
import com.example.court_management_system.Repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseForwardingService {

    private final CaseForwardingRepository repository;
    private final CaseRepository caseRepository;

    // Folder to save uploaded files (adjust path as needed)
    private final Path uploadDir = Paths.get("uploads/judge_cases");

    public CaseForwarding forwardCase(ProsecutorToJudgeFormDTO dto) throws IOException {
        // Ensure upload directory exists
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Save files and collect filenames
        List<String> savedCaseFiles = saveFiles(dto.getCaseFiles());
        List<String> savedEvidenceFiles = saveFiles(dto.getEvidenceFiles());

        CaseForwarding entity = CaseForwarding.builder()
                .caseId(dto.getCaseId())
                .prosecutorId(dto.getProsecutorId())
                .judgeId(dto.getJudgeId())
                .courtName(dto.getCourtName())
                .details(dto.getDetails())
                .evidenceSummary(dto.getEvidenceSummary())
                .witnesses(dto.getWitnesses())
                .caseFileNames(savedCaseFiles)
                .evidenceFileNames(savedEvidenceFiles)
                .build();

        return repository.save(entity);
    }

    public void saveForwarding(CaseForwarding forwarding) {
        repository.save(forwarding);
    }

  public List<CaseForwardingDTO> getCasesByJudge(Long judgeId) {
    List<CaseForwarding> forwardings = repository.findByJudgeId(judgeId);

    return forwardings.stream().map(f -> {
        // Try to get case description from CaseEntity if not present in forwarding
        String details = f.getDetails();
        if (details == null || details.isEmpty()) {
            Optional<CaseEntity> caseOpt = caseRepository.findById(f.getCaseId());
            details = caseOpt.map(c -> c.getCaseDescription()).orElse("N/A"); // FIXED HERE
        }

        return CaseForwardingDTO.builder()
                .caseId(f.getCaseId())
                .details(details)
                .evidenceSummary(f.getEvidenceSummary() != null ? f.getEvidenceSummary() : "N/A")
                .witnesses(f.getWitnesses() != null ? f.getWitnesses() : "N/A")
                .caseFileNames(f.getCaseFileNames() != null ? f.getCaseFileNames() : List.of())
                .evidenceFileNames(f.getEvidenceFileNames() != null ? f.getEvidenceFileNames() : List.of())
                .build();
    }).collect(Collectors.toList());
}



   private List<String> saveFiles(List<MultipartFile> files) {
    if (files == null || files.isEmpty()) return List.of();

    try {
        Path uploadDir = Paths.get("uploads/judge_cases");
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        return files.stream().map(file -> {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            try {
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                return filename;
            } catch (IOException e) {
                throw new RuntimeException("Failed to save file " + filename, e);
            }
        }).collect(Collectors.toList());

    } catch (IOException e) {
        throw new RuntimeException("Error while creating upload directory", e);
    }
}


}
