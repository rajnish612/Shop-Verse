package com.server.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


//Entity representing product attribute table in the database
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(
            mappedBy = "productAttribute",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private Set<ProductAttributeValue> values = new HashSet<>();

}
