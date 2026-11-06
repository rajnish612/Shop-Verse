package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAddressRequestDTO {
    private String city;

    private String state;

    private String country;

    private String locality;

    private String zipCode;
}
