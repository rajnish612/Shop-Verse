package com.server.server.service;

import com.server.server.domain.RoleType;
import com.server.server.entity.Role;
import com.server.server.entity.User;
import com.server.server.repository.RoleRepo;
import com.server.server.repository.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class GoogleLoginService {

    private final UserRepo userRepository;
    private final RoleRepo roleRepository;
    private final JwtService jwtService;

    @Transactional
    public String loginOrRegister(
            String email,
            String name,
            String picture,
            Boolean emailVerified) {

        if (email == null || !Boolean.TRUE.equals(emailVerified)) {
            throw new IllegalArgumentException(
                    "Google email must be verified"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, name, picture));

        // Link Google to an existing account with the same verified email
        user.setGoogleLinked(true);

        // Generate JWT while the transaction is active
        return jwtService.generateToken(user);
    }

    private User createGoogleUser(
            String email,
            String name,
            String picture) {

        Role userRole = roleRepository.findByName(RoleType.USER)
                .orElseThrow(() ->
                        new RuntimeException("USER role not found")
                );

        User user = new User();

        user.setEmail(email);
        user.setName(name);
        user.setAvatar(picture);
        user.setActive(true);
        user.setGoogleLinked(true);
        user.setPassword(null);
        user.setRoles(new ArrayList<>(List.of(userRole)));

        return userRepository.save(user);
    }
}
