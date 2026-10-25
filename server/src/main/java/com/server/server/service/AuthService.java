package com.server.server.service;


import com.server.server.domain.RoleType;
import com.server.server.dto.RegisterUserDTO;
import com.server.server.dto.RegisterUserResponseDTO;
import com.server.server.entity.Role;
import com.server.server.entity.User;
import com.server.server.exception.ApiException;
import com.server.server.repository.RoleRepo;
import com.server.server.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

//Service to handle authentication (login,register,logout etc)
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepo roleRepo;

    //Method to register user using local auth provider
    public RegisterUserResponseDTO registerUser(RegisterUserDTO registerUserDTO) {

        boolean userAlreadyExists = userRepo.existsByEmail(registerUserDTO.getEmail());
        if (userAlreadyExists) {
            throw new ApiException("User already exists", HttpStatus.CONFLICT);
        }
        roleRepo.findAll()
                .forEach(role -> {
                    System.out.println("Role: " + role.getName());
                });
        Role role = roleRepo
                .findByName(RoleType.USER)
                .orElseThrow(() -> new ApiException(
                        "Default user role not found",
                        HttpStatus.INTERNAL_SERVER_ERROR
                ));

        String encodedPassword = passwordEncoder.encode(registerUserDTO.getPassword());
        User user = userRepo.save(User.builder()
                .name(registerUserDTO.getName())
                .email(registerUserDTO.getEmail())
                .password(encodedPassword)
                .avatar(registerUserDTO.getAvatar())
                .roles(List.of(role))
                .build());
        return RegisterUserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .build();

    }


}
