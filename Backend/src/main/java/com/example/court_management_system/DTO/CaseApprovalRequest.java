package com.example.court_management_system.DTO;

import java.util.List;

public class CaseApprovalRequest {
    private String caseId;
    private String hearingDate;
    private List<String> assignedJudges;
    private String assignedCourt;

    // Getters and Setters
    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getHearingDate() {
        return hearingDate;
    }

    public void setHearingDate(String hearingDate) {
        this.hearingDate = hearingDate;
    }

    public List<String> getAssignedJudges() {
        return assignedJudges;
    }

    public void setAssignedJudges(List<String> assignedJudges) {
        this.assignedJudges = assignedJudges;
    }

    public String getAssignedCourt() {
        return assignedCourt;
    }

    public void setAssignedCourt(String assignedCourt) {
        this.assignedCourt = assignedCourt;
    }
}
