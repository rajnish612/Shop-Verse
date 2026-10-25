package com.server.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


//Entity representing user table
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String avatar;

    private boolean googleLinked;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


    @ManyToMany
    @JoinTable(
            name = "user_roles",
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "role_id"}),
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_used_coupons",

            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "coupon_id")
    )
    @JsonIgnore
    private Set<Coupon> usedCoupons = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
}
