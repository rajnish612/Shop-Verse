package com.server.server.controller;

import com.server.server.dto.DashBoardResponseDTO;
import com.server.server.dto.RevenueChartDTO;
import com.server.server.service.DashBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashBoardController {
    private final DashBoardService dashBoardService;

    @GetMapping
    public ResponseEntity<DashBoardResponseDTO> getAdminDashboard() {
        return ResponseEntity.ok(dashBoardService.getDashboardData());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueChartDTO>> getRevenue(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate
    ) {
        return ResponseEntity.ok(
                dashBoardService.getRevenueByDateRange(startDate, endDate)
        );
    }
}
