package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
@AllArgsConstructor
public class CategoryCountResponseDTO {

    private Long rootCount;
    private Long nestedCount;
}
