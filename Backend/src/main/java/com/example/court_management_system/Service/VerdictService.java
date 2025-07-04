package com.example.court_management_system.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.court_management_system.Entity.VerdictEntity;
import com.example.court_management_system.Repository.VerdictRepository;

@Service
public class VerdictService {
    @Autowired
    private VerdictRepository repo;

    public VerdictEntity save(VerdictEntity v) {
        return repo.save(v);
    }

    public List<VerdictEntity> findByJudge(Long judgeId) {
        return repo.findByJudgeId(judgeId);
    }
}