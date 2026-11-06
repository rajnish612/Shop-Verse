package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SelectedAttributeResponseDTO {

    private Long id;

    private String name;

    private String value;
}