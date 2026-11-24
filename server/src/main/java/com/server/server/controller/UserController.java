package com.server.server.controller;


import com.server.server.domain.RoleType;
import com.server.server.dto.UserDTO;
import com.server.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;


    //Get all users with optional filtering by keyword and role
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam(required = false) String keyword, @RequestParam(required = false) RoleType role, @RequestParam(required = false) Boolean active, @AuthenticationPrincipal Jwt jwt, @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
    Pageable pageable) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(userService.getAllUsers(userId, keyword, role, active, pageable));
    }


    //Update role of user
    @PatchMapping("/update-role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateRole(@PathVariable Long userId, @RequestBody List<RoleType> roles) {
        return ResponseEntity.ok(userService.updateRole(userId, roles));
    }

    //Update user status
    @PatchMapping("/update-status/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateStatus(@PathVariable Long userId, @RequestParam boolean active) {
        return ResponseEntity.ok(userService.updateStatus(userId, active));
    }

}
