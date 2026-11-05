package com.server.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"cart_item_id", "attribute_id"}
        )
)
public class CartItemAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_item_id", nullable = false)
    private CartItem cartItem;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false)
    private ProductAttribute attribute;

    @ManyToOne
    @JoinColumn(name = "attribute_value_id", nullable = false)
    private ProductAttributeValue attributeValue;
}
