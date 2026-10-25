package com.server.server.entity;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


//Entity representing coupon table in the database
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {


    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private BigDecimal discount;

    @Column(nullable = false)
    private boolean percentage;

    private LocalDateTime expiresAt;

    private boolean active = true;

    @ManyToMany(mappedBy = "usedCoupons")
    @JsonIgnore
    private Set<User> usedByUsers = new HashSet<>();

}
