// package com.example.court_management_system.Controller;

// import com.example.court_management_system.DTO.ApplicationDTO;
// import com.example.court_management_system.Service.ApplicationService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api/admin/applications")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class ApplicationController {

//     private final ApplicationService applicationService;

//     @GetMapping
//     public List<ApplicationDTO> getAllApplications() {
//         return applicationService.getAllApplications();
//     }

//     // @PostMapping("/submit")
//     // public ApplicationDTO submitApplication(@RequestBody ApplicationDTO dto) {
//     //     return applicationService.submitApplication(dto);
//     // }
// }
