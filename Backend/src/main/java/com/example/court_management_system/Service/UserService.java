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
        UserEntity userEntity = new UserEntity();
        userEntity.setUserName(userDTO.getUserName());
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());
        userEntity.setPhoneNumber(userDTO.getPhoneNumber());
        userEntity.setCity(userDTO.getCity()); // Ensure this matches the entity field
        userEntity.setSubCity(userDTO.getSubCity()); // Ensure this matches the entity field
        userEntity.setPassWord(userDTO.getPassWord());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setStatus(UserEntity.Status.ACTIVE);

        userRepository.save(userEntity);
        return "User created successfully!";
    }

    public UserDTO getUserByUserName(String userName) {
        UserEntity userEntity = userRepository.findByUserName(userName);
        return convertToDTO(userEntity);
    }

    private UserDTO convertToDTO(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(userEntity.getId());
        userDTO.setUserName(userEntity.getUserName());
        userDTO.setFirstName(userEntity.getFirstName());
        userDTO.setLastName(userEntity.getLastName());
        userDTO.setPhoneNumber(userEntity.getPhoneNumber());
        userDTO.setCity(userEntity.getCity()); // Ensure this matches the DTO field
        userDTO.setSubCity(userEntity.getSubCity()); // Ensure this matches the DTO field
        userDTO.setEmail(userEntity.getEmail());
        userDTO.setStatus(userEntity.getStatus().name());
        return userDTO;
    }
}