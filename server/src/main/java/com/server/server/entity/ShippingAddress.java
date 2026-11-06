package com.server.server.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingAddress {

    private String locality;

    private String city;

    private String state;

    private String country;

    private String zipCode;
}