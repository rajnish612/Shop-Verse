package com.server.server.repository;

import com.server.server.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long addressId, Long userId);
}
