package com.server.server.repository;



import com.server.server.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepo
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByUser_Email(String email);

    void deleteByUserId(Long userId);
}
