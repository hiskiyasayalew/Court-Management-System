package com.example.court_management_system.DTO;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProsecutorDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String username;
    private String password;
}
