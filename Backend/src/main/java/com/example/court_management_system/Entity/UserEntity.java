package com.example.court_management_system.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false, unique = true, length = 50)
    private String userName;
    
    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(unique = true, length = 20)
    private String phoneNumber;

     @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE; 

       public enum Status {
        ACTIVE, INACTIVE
    }

}
