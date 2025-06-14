package com.example.court_management_system.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Users")
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

    @Column( length = 20)
    private String phoneNumber;

     @Column(unique = true, length = 20)
    private String city;

    @Column( length = 20)
    private String subCity;

    @Column(unique = true, length = 20)
    private String Password;

  @Column(nullable = false, unique = true, length = 50)
private String email;

     @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE; 

       public enum Status {
        ACTIVE, INACTIVE
    }

}
