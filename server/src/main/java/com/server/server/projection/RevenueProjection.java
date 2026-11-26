package com.server.server.projection;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueProjection {
    LocalDate getPeriod();
    BigDecimal getRevenue();
}