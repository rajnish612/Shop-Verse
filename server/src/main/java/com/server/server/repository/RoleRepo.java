package com.server.server.repository;


import com.server.server.domain.RoleType;
import com.server.server.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

//Repostory to interact with roles table
@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

    //Find role using role name
    Optional<Role> findByName(RoleType name);


    List<Role> findAllByNameIn(List<RoleType> names);
}
