package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

//DTO for Address response
@Data
@Builder
@AllArgsConstructor
public class AddressResponseDTO {
    private Long id;

    private String city;

    private String state;

    private String country;

    private String locality;

    private String zipCode;
}
