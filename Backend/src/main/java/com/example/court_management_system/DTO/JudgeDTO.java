package com.example.court_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // ✅ THIS includes getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JudgeDTO {
     private Long id; 
    private String name;
    private String username;
    private String password;
    private String email;
    private String status;
}
