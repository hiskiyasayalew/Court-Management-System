    package com.example.court_management_system.Entity;

    import jakarta.persistence.*;
    import lombok.*;

    import java.time.LocalDateTime;
    import java.util.List;

    import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @Entity
    @Table(name = "cases")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    
    public class CaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String fullName;
        private String email;
        private String phone;
        private String dateOfIncident;
        private String caseType;

        @Column(columnDefinition = "TEXT")
        private String caseDescription;

        private String idCardUploadName;

        @ElementCollection
        private List<String> additionalFileNames;

        private String agreement;

        @Enumerated(EnumType.STRING)
        private caseStatus status;

        private LocalDateTime submittedAt;

        @Column(length = 1000)
        private String prosecutorReview;
        
        private String court;


        @ManyToOne
        @JoinColumn(name = "user_id")
        private UserEntity user;

        @ManyToOne
        @JoinColumn(name = "prosecutor_id")
        private ProsecutorEntity prosecutor;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "judge_id")
        private JudgeEntity judge;
    }
