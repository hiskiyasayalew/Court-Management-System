package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.JudgeApprovalDTO;
import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.Entity.JudgeDecisionEntity;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Repository.JudgeDecisionRepository;
import com.example.court_management_system.Repository.JudgeRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JudgeService {

    private final JudgeRepository judgeRepository;
    private final JudgeDecisionRepository decisionRepo;

    public JudgeService(JudgeRepository judgeRepository, JudgeDecisionRepository decisionRepo) {
        this.judgeRepository = judgeRepository;
        this.decisionRepo = decisionRepo;
    }

    public JudgeEntity registerJudge(JudgeDTO dto) {
        if (judgeRepository.findByUsername(dto.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        return judgeRepository.save(JudgeEntity.builder()
                .name(dto.getName())
                .username(dto.getUsername())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build());
    }

    public JudgeEntity loginJudge(String username, String password) {
        JudgeEntity judge = judgeRepository.findByUsername(username);
        if (judge != null && judge.getPassword().equals(password)) {
            return judge;
        }
        return null;
    }

    private JudgeDTO toDTO(JudgeEntity entity) {
        return JudgeDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .username(entity.getUsername())
                .password(null) // Don't expose password
                .email(entity.getEmail())
                .status(entity.getStatus())
                .build();
    }

    public List<JudgeDTO> getAllJudges() {
        return judgeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public JudgeDTO getJudgeByUsername(String username) {
        JudgeEntity judge = judgeRepository.findByUsername(username);
        return judge != null ? toDTO(judge) : null;
    }

    public void deleteJudgeById(Long id) {
        judgeRepository.deleteById(id);
    }

    public JudgeDTO updateJudge(JudgeDTO dto) {
        JudgeEntity existing = judgeRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Judge not found"));

        existing.setName(dto.getName());
        existing.setUsername(dto.getUsername());
        existing.setPassword(dto.getPassword());
        existing.setEmail(dto.getEmail());
        existing.setStatus(dto.getStatus());

        return toDTO(judgeRepository.save(existing));
    }

    public JudgeDecisionEntity approveCase(JudgeApprovalDTO dto) {
        JudgeDecisionEntity decision = new JudgeDecisionEntity();
        decision.setCaseId(dto.getCaseId());
        decision.setHearingDate(dto.getHearingDate());
        decision.setAssignedJudges(dto.getAssignedJudges());
        decision.setAssignedCourt(dto.getAssignedCourt());
        decision.setStatus("APPROVED");
        return decisionRepo.save(decision);
    }

    public void rejectCase(Long caseId) {
        JudgeDecisionEntity decision = new JudgeDecisionEntity();
        decision.setCaseId(caseId);
        decision.setStatus("REJECTED");
        decisionRepo.save(decision);
    }

    public List<JudgeDecisionEntity> getUserVisibleSchedule(Long caseId) {
        return decisionRepo.findByCaseId(caseId);
    }
}
