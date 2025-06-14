package com.example.court_management_system.DTO;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String userName;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String password;
    private String city;
    private String subCity;
    private String email;
    private String status; // Use String for Status


}