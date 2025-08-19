package com.example.court_management_system.Controller;

import com.example.court_management_system.DTO.ApplicationDTO;
import com.example.court_management_system.DTO.JudgeDTO;
import com.example.court_management_system.DTO.PoliceDTO;
import com.example.court_management_system.DTO.ProsecutorDTO;
import com.example.court_management_system.DTO.UserDTO;
import com.example.court_management_system.Entity.AdminEntity;
import com.example.court_management_system.Entity.ApplicationEntity;
import com.example.court_management_system.Repository.ApplicationRepository;
import com.example.court_management_system.Service.AdminService;
import com.example.court_management_system.Service.ApplicationService;
import com.example.court_management_system.Service.JudgeService;
import com.example.court_management_system.Service.PoliceService;
import com.example.court_management_system.Service.ProsecutorService;
import com.example.court_management_system.Service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})

public class AdminController {

    private final AdminService adminService;
    @Autowired
    private final UserService userService;
    @Autowired
    private final PoliceService policeService;
    @Autowired
    private final ProsecutorService prosecutorService;
    @Autowired
    private final JudgeService judgeService;
    @Autowired
    private final ApplicationService applicationService;
    @Autowired
    private ApplicationRepository applicationRepository;
    

    @PostMapping("/signup")
    public ResponseEntity<AdminEntity> createAdmin(@RequestBody AdminEntity admin) {
        AdminEntity savedAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }

      @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Optional<String> tokenOpt = adminService.login(username, password);

        if (tokenOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("token", tokenOpt.get()));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }



            @PostMapping("/users/create")
        public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
            String message = userService.registerUser(userDTO);
            return message.contains("exists") ? 
                ResponseEntity.badRequest().body(message) :
                ResponseEntity.ok(message);
        }

        @GetMapping("/users/search")
        public ResponseEntity<?> getUser(@RequestParam String username) {
            UserDTO userDTO = userService.getUserByUserName(username);
            return userDTO != null ? 
                ResponseEntity.ok(userDTO) :
                ResponseEntity.status(404).body("User not found");
        }

            @PutMapping("/users/update")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(dto));
    }

        @DeleteMapping("/users/{id}")
        public ResponseEntity<?> deleteUser(@PathVariable Long id) {
            try {
                userService.deleteUserById(id);
                return ResponseEntity.ok("User deleted");
            } catch (Exception e) {
                return ResponseEntity.status(404).body("User not found");
            }
        }

            @PostMapping("/prosecutor/create")
    public ResponseEntity<?> createProsecutor(@RequestBody ProsecutorDTO dto) {
        return ResponseEntity.ok(prosecutorService.registerProsecutor(dto));
    }

    @GetMapping("/prosecutor/search")
    public ResponseEntity<?> getProsecutor(@RequestParam String username) {
        return ResponseEntity.ok(prosecutorService.login(username, "dummy"));
    }

    @DeleteMapping("/prosecutor/{id}")
    public ResponseEntity<?> deleteProsecutor(@PathVariable Long id) {
        prosecutorService.deleteProsecutorById(id);
        return ResponseEntity.ok("Prosecutor deleted");
    }

    @PutMapping("/prosecutor/update")
    public ResponseEntity<?> updateProsecutor(@RequestBody ProsecutorDTO dto) {
        return ResponseEntity.ok(prosecutorService.updateProsecutor(dto));
    }

        @PostMapping("/judge/create")
    public ResponseEntity<?> createJudge(@RequestBody JudgeDTO dto) {
        return ResponseEntity.ok(judgeService.registerJudge(dto));
    }

    @GetMapping("/judge/search")
    public ResponseEntity<?> getJudge(@RequestParam String username) {
        return ResponseEntity.ok(judgeService.getJudgeByUsername(username));
    }

    @DeleteMapping("/judge/{id}")
    public ResponseEntity<?> deleteJudge(@PathVariable Long id) {
        judgeService.deleteJudgeById(id);
        return ResponseEntity.ok("Judge deleted");
    }

    @PutMapping("/judge/update")
    public ResponseEntity<?> updateJudge(@RequestBody JudgeDTO dto) {
        return ResponseEntity.ok(judgeService.updateJudge(dto));
    }

    @GetMapping("/users")
public ResponseEntity<?> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
}

@GetMapping("/police")
public ResponseEntity<?> getAllPolices() {
    return ResponseEntity.ok(policeService.getAllPolice());
}

@GetMapping("/prosecutor")
public ResponseEntity<?> getAllProsecutors() {
    return ResponseEntity.ok(prosecutorService.getAllProsecutors());
}

@GetMapping("/judge")
public ResponseEntity<?> getAllJudges() {
    return ResponseEntity.ok(judgeService.getAllJudges());
}

// ✅ CREATE Police
    @PostMapping("/police/create")
    public ResponseEntity<?> createPolice(@RequestBody PoliceDTO dto) {
        return ResponseEntity.ok(policeService.registerPolice(dto));
    }

    // ✅ UPDATE Police
    @PutMapping("/police/update")
    public ResponseEntity<?> updatePolice(@RequestBody PoliceDTO dto) {
        return ResponseEntity.ok(policeService.updatePolice(dto));
    }
    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

      @PostMapping(path = "/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationDTO> submitApplication(
            @RequestPart("application") ApplicationDTO application,
            @RequestPart("files") List<MultipartFile> files) {

        // For now: just print file names (you can save them later)
        List<String> fileNames = files.stream()
                                      .map(MultipartFile::getOriginalFilename)
                                      .collect(Collectors.toList());
        application.setEducationFiles(fileNames);

        ApplicationDTO savedApplication = applicationService.submitApplication(application);
        return ResponseEntity.ok(savedApplication);
    }

            
}
