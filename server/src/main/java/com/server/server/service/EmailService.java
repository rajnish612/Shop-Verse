package com.server.server.service;


import com.server.server.config.OtpConfig;
import com.server.server.entity.EmailVerificationToken;
import com.server.server.entity.PasswordResetToken;
import com.server.server.entity.User;
import com.server.server.exception.ApiException;
import com.server.server.repository.EmailVerificationTokenRepo;
import com.server.server.repository.PasswordResetTokenRepo;
import com.server.server.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailVerificationTokenRepo tokenRepo;
    private final PasswordResetTokenRepo passwordResetTokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepo;
    private static final SecureRandom RANDOM = new SecureRandom();
    @Value("${spring.mail.username}")
    private String senderEmail;

    // Generate a 6-digit OTP
    private String generateOtp() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    public void sendVerificationOtp(String recipientEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setSubject("Verify Your Email - Ecommerce Store");

        message.setText(
                "Hello,\n\n" +
                        "Thank you for registering with us.\n\n" +
                        "Your email verification OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not create this account, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Ecommerce Team"
        );

        mailSender.send(message);
    }

    // Create and send OTP during registration
    @Transactional
    public void sendVerificationOtp(User user) {

        String otp = generateOtp();
        LocalDateTime now = LocalDateTime.now();

        EmailVerificationToken token = tokenRepo
                .findByUserId(user.getId())
                .orElseGet(() -> EmailVerificationToken.builder()
                        .user(user)
                        .build());

        token.setOtp(passwordEncoder.encode(otp));
        token.setExpiresAt(
                now.plusMinutes(OtpConfig.OTP_EXPIRY_MINUTES)
        );
        token.setLastSentAt(now);
        token.setAttempts(0);

        tokenRepo.save(token);

        sendVerificationOtp(user.getEmail(), otp);
    }

    // Send password reset OTP
    public void sendPasswordResetOtp(String recipientEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setSubject("Password Reset OTP - Ecommerce Store");

        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your password.\n\n" +
                        "Your password reset OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request a password reset, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Ecommerce Team"
        );

        mailSender.send(message);
    }

    // Send password reset OTP
    @Transactional
    public void sendPasswordResetOtp(String email) {
        Optional<User> optionalUser = userRepo.findByEmail(email);

        // Don't reveal whether an account exists.
        if (optionalUser.isEmpty() || !optionalUser.get()
                .isActive()) {
            return;
        }

        User user = optionalUser.get();
        LocalDateTime now = LocalDateTime.now();

        PasswordResetToken token = passwordResetTokenRepo.findByUser_Email(email)
                .orElseGet(() -> PasswordResetToken.builder()
                        .user(user)
                        .build());

        // Enforce resend cooldown.
        if (token.getLastSentAt() != null &&
                token.getLastSentAt()
                        .plusSeconds(OtpConfig.RESEND_COOLDOWN_SECONDS)
                        .isAfter(now)) {
            throw new ApiException(
                    "Please wait before requesting another OTP",
                    HttpStatus.TOO_MANY_REQUESTS
            );
        }

        String otp = generateOtp();

        token.setOtp(passwordEncoder.encode(otp));
        token.setExpiresAt(now.plusMinutes(OtpConfig.OTP_EXPIRY_MINUTES));
        token.setLastSentAt(now);
        token.setAttempts(0);

        passwordResetTokenRepo.save(token);

        sendPasswordResetOtp(email, otp);
    }

    // Reset password using OTP
    @Transactional(noRollbackFor = ApiException.class)
    public void resetPassword(String email, String otp, String newPassword) {

        PasswordResetToken token = passwordResetTokenRepo
                .findByUser_Email(email)
                .orElseThrow(() -> new ApiException(
                        "Invalid or expired OTP",
                        HttpStatus.BAD_REQUEST
                ));

        LocalDateTime now = LocalDateTime.now();

        if (token.getExpiresAt()
                .isBefore(now)) {
            passwordResetTokenRepo.delete(token);
            throw new ApiException(
                    "OTP has expired. Please request a new OTP.",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (token.getAttempts() >= OtpConfig.MAX_ATTEMPTS) {
            throw new ApiException(
                    "Maximum verification attempts exceeded. Please request a new OTP.",
                    HttpStatus.TOO_MANY_REQUESTS
            );
        }

        if (!passwordEncoder.matches(otp, token.getOtp())) {
            token.setAttempts(token.getAttempts() + 1);
            passwordResetTokenRepo.save(token);

            throw new ApiException(
                    "Invalid OTP",
                    HttpStatus.BAD_REQUEST
            );
        }

        User user = token.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        passwordResetTokenRepo.delete(token);
    }

    // Verify user's email using OTP
    @Transactional(noRollbackFor = ApiException.class)
    public void verifyOtp(String email, String otp) {

        EmailVerificationToken token = tokenRepo
                .findByUser_Email(email)
                .orElseThrow(() -> new ApiException(
                        "No pending email verification found",
                        HttpStatus.NOT_FOUND
                ));

        if (token.getExpiresAt()
                .isBefore(LocalDateTime.now())) {
            tokenRepo.delete(token);

            throw new ApiException(
                    "OTP has expired. Please request a new OTP.",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (token.getAttempts() >= OtpConfig.MAX_ATTEMPTS) {
            throw new ApiException(
                    "Maximum verification attempts exceeded. Please request a new OTP.",
                    HttpStatus.TOO_MANY_REQUESTS
            );
        }

        if (!passwordEncoder.matches(otp, token.getOtp())) {

            token.setAttempts(token.getAttempts() + 1);
            tokenRepo.save(token);

            throw new ApiException(
                    "Invalid OTP",
                    HttpStatus.BAD_REQUEST
            );
        }

        User user = token.getUser();
        user.setActive(true);

        userRepo.save(user);
        tokenRepo.delete(token);
    }

    // Resend OTP
    @Transactional
    public void resendOtp(String email) {

        EmailVerificationToken token = tokenRepo
                .findByUser_Email(email)
                .orElseThrow(() -> new ApiException(
                        "No pending email verification found",
                        HttpStatus.NOT_FOUND
                ));

        LocalDateTime now = LocalDateTime.now();

        if (token.getUser()
                .isActive()) {
            throw new ApiException(
                    "Email is already verified",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (token.getLastSentAt()
                .plusSeconds(OtpConfig.RESEND_COOLDOWN_SECONDS)
                .isAfter(now)) {

            throw new ApiException(
                    "Please wait before requesting another OTP",
                    HttpStatus.TOO_MANY_REQUESTS
            );
        }

        String otp = generateOtp();

        token.setOtp(passwordEncoder.encode(otp));
        token.setExpiresAt(
                now.plusMinutes(OtpConfig.OTP_EXPIRY_MINUTES)
        );
        token.setLastSentAt(now);
        token.setAttempts(0);

        tokenRepo.save(token);

        sendVerificationOtp(email, otp);
    }


}