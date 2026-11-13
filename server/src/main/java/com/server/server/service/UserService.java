package com.server.server.service;


import com.server.server.domain.RoleType;
import com.server.server.dto.AddressResponseDTO;
import com.server.server.dto.UserDTO;
import com.server.server.entity.Role;
import com.server.server.entity.User;
import com.server.server.exception.ApiException;
import com.server.server.repository.RoleRepo;
import com.server.server.repository.UserRepo;
import com.server.server.specification.UserDetailsSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final RoleRepo roleRepo;


    //Update role of user
    @Transactional
    public UserDTO updateRole(Long userId, List<RoleType> roles) {
        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new ApiException("User not found", HttpStatus.NOT_FOUND));
        List<Role> rolesToAssign = roleRepo.findAllByNameIn(roles);

        if (!roles.isEmpty()) {

            // Check if all roles exist
            if (rolesToAssign.size() != roles.stream()
                    .distinct()
                    .count()) {
                throw new ApiException(
                        "One or more roles not found",
                        HttpStatus.NOT_FOUND);
            }
            // Preserve existing roles
            for (Role role : rolesToAssign) {
                boolean alreadyAssigned = user.getRoles()
                        .stream()
                        .anyMatch(existingRole ->
                                existingRole.getName() == role.getName());

                if (!alreadyAssigned) {
                    user.getRoles()
                            .add(role);
                }
            }
        } else {
            user.setRoles(user.getRoles()
                    .stream()
                    .filter(role -> role.getName() == RoleType.USER)
                    .collect(Collectors.toList())
            );
        }
        return toUserDetailsResponseDTO(userRepo.save(user));
    }

    //Get all users
    public List<UserDTO> getAllUsers(String keyword, RoleType roleType, Boolean isActive) {
        System.out.println("isActive: " + isActive);
        Specification<User> spec = UserDetailsSpecification.search(keyword)
                .and(UserDetailsSpecification.isActive(isActive));

        if (roleType != null) {
            Role role = roleRepo.findByName(roleType)
                    .orElseThrow(() ->
                            new ApiException("Role not found", HttpStatus.NOT_FOUND));

            spec = spec.and(UserDetailsSpecification.hasRole(role));
        }

        return userRepo.findAll(spec)
                .stream()
                .map(this::toUserDetailsResponseDTO)
                .toList();
    }

    //Get current user details
    public UserDTO getCurrentUserDetails(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return toUserDetailsResponseDTO(user);
    }

    //Convert user entity to user details response dto
    public UserDTO toUserDetailsResponseDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .addresses(user.getAddresses()
                        .stream()
                        .map(address -> AddressResponseDTO.builder()
                                .state(address.getState())
                                .locality(address.getLocality())
                                .city(address.getCity())
                                .state(address.getState())
                                .zipCode(address.getZipCode())
                                .build())
                        .toList()
                )
                .googleLinked(user.isGoogleLinked())
                .active(user.isActive())
                .avatar(user.getAvatar())
                .joinedAt(user.getCreatedAt())
                .roles(user.getRoles()
                        .stream()
                        .map(role -> role.getName()
                                .toString())
                        .toList()
                )
                .joinedAt(user.getCreatedAt())
                .build();
    }


    //Update user status (active/inactive)
    @Transactional
    public UserDTO updateStatus(Long userId, boolean active) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        user.setActive(active);
        return toUserDetailsResponseDTO(userRepo.save(user));
    }
}
