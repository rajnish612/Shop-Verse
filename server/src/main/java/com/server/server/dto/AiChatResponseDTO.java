package com.server.server.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class AiChatResponseDTO {

    private String message;

    private List<ProductResponseDTO> products;
}