package com.server.server.controller;

import com.server.server.dto.DashBoardResponseDTO;
import com.server.server.service.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashBoardController {
    private final DashBoardService dashBoardService;

    @GetMapping
    public ResponseEntity<DashBoardResponseDTO> getAdminDashboard() {
        return ResponseEntity.ok(dashBoardService.getDashboardData());
    }
}
