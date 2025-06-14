package com.example.court_management_system.Service;

import com.example.court_management_system.Entity.UserEntity;
import com.example.court_management_system.DTO.UserDTO;
import com.example.court_management_system.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(UserDTO userDTO) {
        // Check for existing user with same username or email
        if (userRepository.findByUserName(userDTO.getUserName()) != null) {
            return "Username already exists!";
        }
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            return "Email already exists!";
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUserName(userDTO.getUserName());
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setCity(userDTO.getCity());
        userEntity.setSubCity(userDTO.getSubCity());
        userEntity.setPassword(userDTO.getPassword());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setStatus(UserEntity.Status.ACTIVE);

        userRepository.save(userEntity);
        return "User created successfully!";
    }

    public UserDTO getUserByUserName(String userName) {
        UserEntity userEntity = userRepository.findByUserName(userName);
        if (userEntity == null) return null;
        return convertToDTO(userEntity);
    }

    private UserDTO convertToDTO(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userEntity.getId());
        userDTO.setUserName(userEntity.getUserName());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setPhoneNumber(userEntity.getPhoneNumber());
        userDTO.setCity(userEntity.getCity());
        userDTO.setSubCity(userEntity.getSubCity());
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setPassword(userEntity.getPassword()); // Fix: include password
        userDTO.setStatus(userEntity.getStatus().name());
        return userDTO;
    }
}
