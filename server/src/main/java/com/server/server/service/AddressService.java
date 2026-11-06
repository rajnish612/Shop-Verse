package com.server.server.service;

import com.server.server.dto.AddressResponseDTO;
import com.server.server.dto.CreateAddressRequestDTO;
import com.server.server.dto.UpdateAddressRequestDTO;
import com.server.server.entity.Address;
import com.server.server.entity.User;
import com.server.server.exception.ApiException;
import com.server.server.repository.AddressRepo;
import com.server.server.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepo addressRepo;
    private final UserRepo userRepo;

    //Retrieve all addresses associated with a specific user by their user ID
    public List<AddressResponseDTO> getUserAddresses(Long userId) {
        return addressRepo.findByUserId(userId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }


    //Create address for a specific user by their user ID
    public AddressResponseDTO createAddress(CreateAddressRequestDTO createAddressDTO, Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Address address = addressRepo.save(Address.builder()
                .locality(createAddressDTO.getLocality())
                .city(createAddressDTO.getCity())
                .state(createAddressDTO.getState())
                .zipCode(createAddressDTO.getZipCode())
                .country(createAddressDTO.getCountry())
                .user(user)
                .build());

        return toResponseDTO(address);
    }

    //Find address for a specific user by their user ID and address ID
    public AddressResponseDTO findAddressUsingUserIdAndAddressId(Long userId, Long addressId) {
        Address address = addressRepo.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ApiException("Address not found", HttpStatus.NOT_FOUND));

        return toResponseDTO(address);
    }

    //Delete address for a specific user by their user ID and address ID
    public void deleteAddress(Long addressId, Long userId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser()
                .getId()
                .equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this address");
        }

        addressRepo.delete(address);
    }

    //Update address for a specific user by their user ID and address ID
    public AddressResponseDTO updateAddress(Long addressId, UpdateAddressRequestDTO updateAddressDTO, Long userId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser()
                .getId()
                .equals(userId)) {
            throw new RuntimeException("You are not authorized to update this address");
        }

        if (updateAddressDTO.getLocality() != null) {
            address.setLocality(updateAddressDTO.getLocality());
        }
        if (updateAddressDTO.getCity() != null) {
            address.setCity(updateAddressDTO.getCity());
        }
        if (updateAddressDTO.getState() != null) {
            address.setState(updateAddressDTO.getState());
        }
        if (updateAddressDTO.getZipCode() != null) {
            address.setZipCode(updateAddressDTO.getZipCode());
        }
        if (updateAddressDTO.getCountry() != null) {
            address.setCountry(updateAddressDTO.getCountry());
        }


        addressRepo.save(address);

        return toResponseDTO(
                address
        );
    }


    //Private method to convert Address entity to AddressResponseDTO
    public AddressResponseDTO toResponseDTO(Address address) {
        return new AddressResponseDTO(
                address.getId(),
                address.getCity(),
                address.getState(),
                address.getCountry(),
                address.getLocality(),
                address.getZipCode()
        );
    }
}
