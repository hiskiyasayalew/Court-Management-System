package com.example.court_management_system.DTO;

import lombok.Data;

@Data
public class AdminDTO {
    private Long id;
    private String fullName;
    private String username;
    private String password;
    private String email;
}
