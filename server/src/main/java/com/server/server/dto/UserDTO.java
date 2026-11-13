package com.server.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String email;
    private List<String> roles;
    private String name;
    private String avatar;
    private boolean active;
    private boolean googleLinked;
    private List<AddressResponseDTO> addresses;
    private LocalDateTime joinedAt;
}
