package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String code;
    private int level;
    private List<CategoryResponseDTO> children = new ArrayList<>();
}
