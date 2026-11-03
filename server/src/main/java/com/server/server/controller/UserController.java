package com.server.server.controller;


import com.server.server.domain.RoleType;
import com.server.server.dto.UserDetailsResponseDTO;
import com.server.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    //Get all users with optional filtering by keyword and role
    @GetMapping
    public ResponseEntity<List<UserDetailsResponseDTO>> getAllUsers(@RequestParam(required = false) String keyword, @RequestParam(required = false) RoleType role, @RequestParam(required = false) Boolean active) {
        return ResponseEntity.ok(userService.getAllUsers(keyword, role, active)); // Replace with actual implementation
    }


    //Update role of user
    @PatchMapping("/update-role/{userId}")
    public ResponseEntity<UserDetailsResponseDTO> updateRole(@PathVariable Long userId, @RequestBody List<RoleType> roles) {
        return ResponseEntity.ok(userService.updateRole(userId, roles));
    }

    //Update user status
    @PatchMapping("/update-status/{userId}")
    public ResponseEntity<UserDetailsResponseDTO> updateStatus(@PathVariable Long userId, @RequestParam boolean active) {
        return ResponseEntity.ok(userService.updateStatus(userId, active));
    }

}
