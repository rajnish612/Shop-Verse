package com.server.server.service;

import com.server.server.domain.OrderStatus;
import com.server.server.dto.DashBoardResponseDTO;
import com.server.server.dto.RevenueChartDTO;
import com.server.server.projection.RevenueProjection;
import com.server.server.repository.OrderRepo;
import com.server.server.repository.ProductRepo;
import com.server.server.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    //
    public List<RevenueChartDTO> getRevenueByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate == null || endDate == null ||
                startDate.isAfter(endDate) ||
                endDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Invalid date range");
        }

        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        String groupBy = days <= 31 ? "day" : "month";

        List<RevenueProjection> results =
                orderRepo.getRevenueByDateRange(
                        OrderStatus.DELIVERED.name(),
                        startDate.atStartOfDay(),
                        endDate.plusDays(1)
                                .atStartOfDay(),
                        groupBy
                );

        Map<LocalDate, BigDecimal> revenueMap = new HashMap<>();

        for (RevenueProjection row : results) {
            revenueMap.put(row.getPeriod(), row.getRevenue());
        }

        List<RevenueChartDTO> response = new ArrayList<>();

        if (groupBy.equals("day")) {
            for (LocalDate date = startDate;
                 !date.isAfter(endDate);
                 date = date.plusDays(1)) {

                response.add(new RevenueChartDTO(
                        date.toString(),
                        revenueMap.getOrDefault(date, BigDecimal.ZERO)
                ));
            }
        } else {
            YearMonth startMonth = YearMonth.from(startDate);
            YearMonth endMonth = YearMonth.from(endDate);

            for (YearMonth month = startMonth;
                 !month.isAfter(endMonth);
                 month = month.plusMonths(1)) {

                LocalDate period = month.atDay(1);

                response.add(new RevenueChartDTO(
                        period.toString(),
                        revenueMap.getOrDefault(period, BigDecimal.ZERO)
                ));
            }
        }

        return response;
    }
}
