package com.server.server.config;


public final class OtpConfig {

    private OtpConfig() {
    }

    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 5;
    public static final int RESEND_COOLDOWN_SECONDS = 60;
    public static final int MAX_ATTEMPTS = 5;
}
