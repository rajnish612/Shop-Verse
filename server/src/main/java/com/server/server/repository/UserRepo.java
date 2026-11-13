package com.server.server.repository;

import com.server.server.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//User repository to interact with user table
@Repository
public interface UserRepo extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    //Check if user  exist by email
    boolean existsByEmail(String email);

    //Find user using email
    @EntityGraph(attributePaths = {"roles"})
    Optional<User> findByEmail(String email);
}
