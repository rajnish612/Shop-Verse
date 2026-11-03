package com.server.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequestDTO {

    @NotBlank(message = "Category name is required")
    private String name;

    @NotBlank(message = "Category code is required")
    private String code;

    private Long parentId;
}
