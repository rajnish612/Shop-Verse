package com.server.server.service;


import com.server.server.domain.RoleType;
import com.server.server.dto.RegisterUserDTO;
import com.server.server.dto.RegisterUserResponseDTO;
import com.server.server.dto.ResetPasswordDTO;
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
    private final EmailService emailService;

    //Method to register user using local auth provider
    public void registerUser(RegisterUserDTO registerUserDTO) {

        boolean userAlreadyExists = userRepo.existsByEmail(registerUserDTO.getEmail());
        if (userAlreadyExists) {

            User existingUser = userRepo.findByEmail(registerUserDTO.getEmail())
                    .orElseThrow(() -> new ApiException(
                            "User already exists",
                            HttpStatus.CONFLICT
                    ));

            if (existingUser.isActive()) {
                throw new ApiException(
                        "An account with this email already exists",
                        HttpStatus.CONFLICT
                );
            }

            emailService.resendOtp(existingUser.getEmail());
            return;
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
                .active(false)
                .roles(List.of(role))
                .build());
        emailService.sendVerificationOtp(user);

    }

    // Verify email
    public void verifyEmail(String email, String otp) {
        emailService.verifyOtp(email, otp);
    }

    // Resend OTP
    public void resendOtp(String email) {
        emailService.resendOtp(email);
    }

    public void forgotPassword(String email) {
        emailService.sendPasswordResetOtp(email);
    }

    public void resetPassword(ResetPasswordDTO dto) {
        emailService.resetPassword(
                dto.getEmail(),
                dto.getOtp(),
                dto.getNewPassword()
        );
    }
}
