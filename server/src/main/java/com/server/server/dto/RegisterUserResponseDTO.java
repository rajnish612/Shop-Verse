package com.server.server.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


//DTo for response of registering user
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUserResponseDTO {

    private Long id;
    private String email;

    private String name;


    private String avatar;
}
