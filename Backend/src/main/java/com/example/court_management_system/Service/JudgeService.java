package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.Entity.JudgeEntity;
import com.example.court_management_system.Repository.JudgeRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JudgeService {

    @Autowired
    private JudgeRepository judgeRepository;

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

   public List<JudgeDTO> getAllJudges() {
    List<JudgeEntity> judgeEntities = judgeRepository.findAll();
    return judgeEntities.stream()
        .map(judge -> JudgeDTO.builder()
            .name(judge.getName())
            .username(judge.getUsername())
            .password(null)  // Never expose password in DTO responses
            .email(judge.getEmail())
            .status(judge.getStatus())
            .build())
        .toList();
}

}
