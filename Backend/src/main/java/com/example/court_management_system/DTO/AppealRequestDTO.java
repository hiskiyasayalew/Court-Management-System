package com.example.court_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppealRequestDTO {
    private Long caseId;
    private String userName;
    private String reason;
}
