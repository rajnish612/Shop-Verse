package com.server.server.dto;


import com.server.server.domain.OrderStatus;
import com.server.server.domain.PaymentMethod;
import com.server.server.domain.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

//
@Data
@Builder
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String orderNumber;
    private OrderStatus orderStatus;

    private LocalDateTime orderDate;

    private LocalDateTime deliveryDate;

    private AddressResponseDTO shippingAddress;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String paymentTransactionId;

    private Set<OrderItemResponseDTO> orderItems;

    private BigDecimal totalPrice;
}

