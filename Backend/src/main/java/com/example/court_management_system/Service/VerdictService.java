package com.example.court_management_system.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.court_management_system.DTO.VerdictDTO;
import com.example.court_management_system.Entity.CaseEntity;
import com.example.court_management_system.Entity.VerdictEntity;
import com.example.court_management_system.Repository.CaseRepository;
import com.example.court_management_system.Repository.VerdictRepository;
import com.example.court_management_system.Entity.caseStatus;

@Service
public class VerdictService {

    @Autowired
    private VerdictRepository repo;

    @Autowired
    private CaseRepository caseRepo;

    // Updated save method to accept VerdictDTO and update case status
    public void save(VerdictDTO dto) {
        // Save verdict entity
        VerdictEntity verdict = new VerdictEntity();
        verdict.setCaseId(dto.getCaseId());
        verdict.setVerdictText(dto.getVerdictText());
        verdict.setVerdictDate(LocalDateTime.now());
        verdict.setJudgeId(dto.getJudgeId());
        repo.save(verdict);

        // Update case status to CLOSED
        CaseEntity caseEntity = caseRepo.findById(dto.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + dto.getCaseId()));
        caseEntity.setStatus(caseStatus.CLOSED);
        caseRepo.save(caseEntity);
    }

    public List<VerdictEntity> findByJudge(Long judgeId) {
        return repo.findByJudgeId(judgeId);
    }

    public VerdictEntity findByCaseId(Long caseId) {
        return repo.findByCaseId(caseId);
    }
}
