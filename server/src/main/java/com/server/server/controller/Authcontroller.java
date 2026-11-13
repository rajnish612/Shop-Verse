package com.server.server.controller;


import com.server.server.dto.LoginRequestDTO;
import com.server.server.dto.RegisterUserDTO;
import com.server.server.dto.UserDTO;
import com.server.server.entity.User;
import com.server.server.service.AuthService;
import com.server.server.service.CustomUserDetails;
import com.server.server.service.JwtService;
import com.server.server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
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
    private final UserService userService;

    //Register user using local auth provider
    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterUserDTO registerUserDTO) {
        authService.registerUser(registerUserDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    //Login user using local auth provider
    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(), loginRequestDTO.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        String token = jwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false) // true in production with HTTPS
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();

    }

    //Get current user details
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(userService.getCurrentUserDetails(jwt.getClaim("userId")));
    }

    // Logout user
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        // Invalidate existing session, if present (Google OAuth2)
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        // Clear Spring Security authentication
        SecurityContextHolder.clearContext();

        // Expire JWT cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // true in production with HTTPS
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
