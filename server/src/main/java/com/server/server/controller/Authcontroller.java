package com.server.server.controller;


import com.server.server.dto.LoginRequestDTO;
import com.server.server.dto.RegisterUserDTO;
import com.server.server.entity.User;
import com.server.server.service.AuthService;
import com.server.server.service.CustomUserDetails;
import com.server.server.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

//Controller to handle authentication flow
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class Authcontroller {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    //Register user using local auth provider
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        authService.registerUser(registerUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    //Login user using local auth provider
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(token);

    }


}
