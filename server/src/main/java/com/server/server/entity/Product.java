package com.server.server.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//Entity representing product table in the database
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;

    private String description;


    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    private int numRatings;

    @Column(nullable = false)
    private int stockQuantity;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private BigDecimal mrpPrice;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount;


    @ManyToMany
    @JoinTable(
            name = "product_attribute_values",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "attribute_value_id"),
            uniqueConstraints =
            @UniqueConstraint(
                    columnNames = {"product_id", "attribute_value_id"}
            )

    )
    private Set<ProductAttributeValue> productAttributeValues = new HashSet<>();
}
