package com.server.server.entity;


import com.server.server.domain.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

//Entity representing order table in the database
@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private String orderNumber;

    @PrePersist
    public void generateOrderNumber() {
        if (orderNumber == null) {
            orderNumber = "ORD-" +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 12)
                            .toUpperCase();
        }
    }

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Embedded
    private PaymentDetails paymentDetails;

    @Embedded
    private ShippingAddress shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus = OrderStatus.CONFIRMED;

    private LocalDateTime orderDate = LocalDateTime.now();

    private LocalDateTime deliveryDate = orderDate.plusDays(7);
}
