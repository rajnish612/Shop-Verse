package com.server.server.service;

import com.server.server.domain.OrderStatus;
import com.server.server.dto.DashBoardResponseDTO;
import com.server.server.repository.OrderRepo;
import com.server.server.repository.ProductRepo;
import com.server.server.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashBoardService {

    private final OrderRepo orderRepo;
    private final UserRepo userRepo;
    private final ProductRepo productRepo;

    //Method to get dashboard data
    public DashBoardResponseDTO getDashboardData() {

        Long totalOrders = orderRepo.count();
        BigDecimal totalRevenue = orderRepo.getTotalRevenue(OrderStatus.CONFIRMED);
        Long totalUsers = userRepo.count();
        Long totalProducts = productRepo.count();

        return DashBoardResponseDTO.builder()
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalRevenue(totalRevenue)
                .totalUsers(totalUsers)
                .build();
    }
}
