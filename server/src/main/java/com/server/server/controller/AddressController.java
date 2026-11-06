package com.server.server.controller;

import com.server.server.dto.AddressResponseDTO;
import com.server.server.dto.CreateAddressRequestDTO;
import com.server.server.dto.UpdateAddressRequestDTO;
import com.server.server.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    //Endpoint  to get a specific address for a user
    @GetMapping("/{addressId}")
    public ResponseEntity<AddressResponseDTO> getAddress(@RequestParam Long userId,
                                                         @PathVariable("addressId") Long addressId) {
        return ResponseEntity.ok(addressService.findAddressUsingUserIdAndAddressId(userId, addressId));
    }

    // Endpoint to add a new address
    @PostMapping("/add")
    public ResponseEntity<AddressResponseDTO> addAddress(@RequestParam Long userId,
                                                         @RequestBody
                                                         CreateAddressRequestDTO dto) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.createAddress(dto, userId));
    }

    //Get all addresses for a specific user
    @GetMapping("/user")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@RequestParam Long userId) {
        return ResponseEntity.ok(addressService.getUserAddresses(userId));
    }

    //Delete an address for a specific user
    @DeleteMapping("/delete/{addressId}")
    public ResponseEntity<Void> deleteAddress(@RequestParam Long userId,
                                              @PathVariable("addressId") Long addressId) {
        addressService.deleteAddress(addressId, userId);
        return ResponseEntity.noContent()
                .build();
    }


    //Endpoint to update an existing address
    @PutMapping("/update/{addressId}")
    public ResponseEntity<AddressResponseDTO> updateAddress(@RequestParam Long userId,
                                                            @PathVariable("addressId") Long addressId,
                                                            @RequestBody UpdateAddressRequestDTO dto) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, dto, userId));
    }
}
