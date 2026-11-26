package com.server.server.repository;


import com.server.server.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepo
        extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByUserId(Long userId);

    Optional<EmailVerificationToken> findByUser_Email(String email);

    void deleteByUserId(Long userId);
}
