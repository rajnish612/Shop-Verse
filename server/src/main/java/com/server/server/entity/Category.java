package com.server.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;


//Entity representing product category table in the database
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"name", "parent_id"}
        )
)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent",cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Category> children = new HashSet<>();


    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private int level;
}
