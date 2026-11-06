package com.server.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


//DTO for creating address request
@Data
@Builder
@AllArgsConstructor
public class CreateAddressRequestDTO {

    @NotBlank(message = "City cannot be blank")
    private String city;

    @NotBlank(message = "State cannot be blank")
    private String state;

    @NotBlank(message = "Country cannot be blank")
    private String country;

    @NotBlank(message = "Locality cannot be blank")
    private String locality;

    @NotBlank(message = "Zip code cannot be blank")
    private String zipCode;

}
