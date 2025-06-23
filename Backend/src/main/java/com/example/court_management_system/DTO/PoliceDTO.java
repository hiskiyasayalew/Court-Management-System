package com.example.court_management_system.DTO;

import lombok.Data;

@Data
public class PoliceDTO {
    private Long id;
    private String officerName;
    private String position;
    private String email;
    private String phoneNumber;
    private String username;
    private String password;
}
