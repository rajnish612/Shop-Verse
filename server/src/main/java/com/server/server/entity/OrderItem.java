package com.server.server.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

//Entity representing order table in the database
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;


    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "order_item_attribute_values",
            joinColumns = @JoinColumn(name = "order_item_id"),
            inverseJoinColumns = @JoinColumn(name = "attribute_value_id")
    )
    private List<ProductAttributeValue> selectedAttributes =
            new ArrayList<>();
}
