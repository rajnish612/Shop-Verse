package com.server.server.service;


import com.server.server.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;


//Custom jwt service to generate jwt token
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;


    //Inject key and expiration time
    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }


    //Generate token
    public String generateToken(User user) {

        Date now = new Date();

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim(
                        "roles",
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName().name())
                                .toList()
                )
                .issuedAt(now)
                .expiration(
                        new Date(now.getTime() + expiration)
                )
                .signWith(secretKey,Jwts.SIG.HS256)
                .compact();
    }
}