package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.ProsecutorToJudgeFormDTO;
import com.example.court_management_system.Entity.*;
import com.example.court_management_system.Repository.*;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;  

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProsecutorToJudgeFormService {

    private final CaseRepository caseRepository;
    private final ProsecutorRepository prosecutorRepository;
    private final JudgeRepository judgeRepository;
    private final ProsecutorToJudgeFormRepository formRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public String submitFormToJudge(ProsecutorToJudgeFormDTO dto) throws IOException {
        CaseEntity caseEntity = caseRepository.findById(dto.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        ProsecutorEntity prosecutor = prosecutorRepository.findById(dto.getProsecutorId())
                .orElseThrow(() -> new RuntimeException("Prosecutor not found"));

        JudgeEntity judge = judgeRepository.findById(dto.getJudgeId())
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        List<String> savedCaseFiles = fileStorageService.saveFiles(dto.getCaseFiles());
        List<String> savedEvidenceFiles = fileStorageService.saveFiles(dto.getEvidenceFiles());

        ProsecutorToJudgeFormEntity formEntity = ProsecutorToJudgeFormEntity.builder()
                .caseEntity(caseEntity)
                .prosecutor(prosecutor)
                .judge(judge)
                .details(dto.getDetails())
                .evidenceSummary(dto.getEvidenceSummary())
                .witnesses(dto.getWitnesses())
                .caseFiles(savedCaseFiles)
                .evidenceFiles(savedEvidenceFiles)
                .submittedAt(LocalDateTime.now())
                .build();

        formRepository.save(formEntity);

        caseEntity.setStatus(caseStatus.OPEN);  // Optional status update
        caseRepository.save(caseEntity);

        return "Form submitted to judge successfully";
    }
}
