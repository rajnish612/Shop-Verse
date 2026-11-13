package com.server.server.controller;

import com.server.server.dto.AddressResponseDTO;
import com.server.server.dto.CreateAddressRequestDTO;
import com.server.server.dto.UpdateAddressRequestDTO;
import com.server.server.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    //Endpoint  to get a specific address for a user
    @GetMapping("/{addressId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AddressResponseDTO> getAddress(@AuthenticationPrincipal Jwt jwt,
                                                         @PathVariable("addressId") Long addressId) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(addressService.findAddressUsingUserIdAndAddressId(userId, addressId));
    }

    // Endpoint to add a new address
    @PostMapping("/add")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AddressResponseDTO> addAddress(@AuthenticationPrincipal Jwt jwt,
                                                         @RequestBody
                                                         CreateAddressRequestDTO dto) {
        Long userId = jwt.getClaim("userId");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.createAddress(dto, userId));
    }

    //Get all addresses for a specific user
    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@AuthenticationPrincipal Jwt jwt) {
        Long userId = jwt.getClaim("userId");

        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }

    //Delete an address for a specific user
    @DeleteMapping("/delete/{addressId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal Jwt jwt,
                                              @PathVariable("addressId") Long addressId) {
        Long userId = jwt.getClaim("userId");
        addressService.deleteAddress(addressId, userId);
        return ResponseEntity.noContent()
                .build();
    }


    //Endpoint to update an existing address
    @PutMapping("/update/{addressId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AddressResponseDTO> updateAddress(@AuthenticationPrincipal Jwt jwt,
                                                            @PathVariable("addressId") Long addressId,
                                                            @RequestBody UpdateAddressRequestDTO dto) {
        Long userId = jwt.getClaim("userId");
        return ResponseEntity.ok(addressService.updateAddress(addressId, dto, userId));
    }
}
