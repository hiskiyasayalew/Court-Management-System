package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.Entity.CaseForwarding;
import com.example.court_management_system.Repository.CaseForwardingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseForwardingService {

    private final CaseForwardingRepository repository;

    // Folder to save uploaded files (adjust path as needed)
    private final Path uploadDir = Paths.get("uploads/judge_cases");

    public CaseForwarding forwardCase(ProsecutorToJudgeFormDTO dto) throws IOException {

        // Make sure upload directory exists
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

    private List<String> saveFiles(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) return List.of();

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
    }
}
