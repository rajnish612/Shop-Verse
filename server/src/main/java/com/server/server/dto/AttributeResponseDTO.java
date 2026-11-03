package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

//DTO for Product Attribute response
@Data
@Builder
@AllArgsConstructor
public class AttributeResponseDTO {
    private Long id;
    private String name;
    private Map<Long,String> values;
}
