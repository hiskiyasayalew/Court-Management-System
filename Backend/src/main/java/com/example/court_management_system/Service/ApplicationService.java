package com.example.court_management_system.Service;

import com.example.court_management_system.DTO.ApplicationDTO;
import com.example.court_management_system.Entity.ApplicationEntity;
import com.example.court_management_system.Repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public List<ApplicationDTO> getAllApplications() {
        return applicationRepository.findAll().stream().map(app ->
            ApplicationDTO.builder()
                .id(app.getId())
                .role(app.getRole())
                .fullName(app.getFullName())
                .email(app.getEmail())
                .phoneNumber(app.getPhoneNumber())
                .reason(app.getReason())
                .education(app.getEducation())
                .workExperience(app.getWorkExperience())
                .additionalInfo(app.getAdditionalInfo())
                .educationFiles(app.getEducationFiles())
                .build()
        ).collect(Collectors.toList());
    }

    public ApplicationDTO submitApplication(ApplicationDTO dto) {
        ApplicationEntity app = ApplicationEntity.builder()
                .role(dto.getRole())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .reason(dto.getReason())
                .education(dto.getEducation())
                .workExperience(dto.getWorkExperience())
                .additionalInfo(dto.getAdditionalInfo())
                .educationFiles(dto.getEducationFiles())
                .build();

        ApplicationEntity saved = applicationRepository.save(app);

        return ApplicationDTO.builder()
                .id(saved.getId())
                .role(saved.getRole())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .phoneNumber(saved.getPhoneNumber())
                .reason(saved.getReason())
                .education(saved.getEducation())
                .workExperience(saved.getWorkExperience())
                .additionalInfo(saved.getAdditionalInfo())
                .educationFiles(saved.getEducationFiles())
                .build();
    }
}
