package com.server.server.entity;

import jakarta.persistence.*;
import lombok.*;


//Entity representing product attribute value
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"product_attribute_id", "value"}
        )
)
@Builder
public class ProductAttributeValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "product_attribute_id", nullable = false)
    private ProductAttribute productAttribute;


    @Column(nullable = false)
    private String value;


}
