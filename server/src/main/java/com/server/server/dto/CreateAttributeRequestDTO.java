package com.server.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;


//DTO for creating attribute
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAttributeRequestDTO {

    @NotBlank(message = "Attribute name cannot be blank")
    private String name;

    @NotEmpty(message = "At least one value must be provided for the attribute")
    private Set<String> values;
}
