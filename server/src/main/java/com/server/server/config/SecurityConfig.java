package com.server.server.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;


//Security Config
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain httpSecurityFilterChain(HttpSecurity httpSecurity) {
        return httpSecurity.csrf(AbstractHttpConfigurer::disable)


                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(r -> r.requestMatchers("/**")
                        .permitAll()
                )
//                .authorizeHttpRequests(r -> r.requestMatchers("/api/auth/**", "/oauth2/**", "/login/**")
//                        .permitAll()
//                        .anyRequest()
//                        .authenticated())
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
                .oauth2Login(Customizer.withDefaults()) //Enables oauth 2 authentication
                .build();
    }

    //Auth manager use to authenticate user using username password authentication
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {

        return authenticationConfiguration.getAuthenticationManager();
    }


    //Global password encoder
    @Bean
    public PasswordEncoder passwordEncoder() { //Password encoder
        return new BCryptPasswordEncoder();
    }


    //Jwt decoder use by oauth2 resource server
    @Bean
    public JwtDecoder jwtDecoder(@Value("${jwt.secret}") String secret) {

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

        return NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }


    // Converts the JWT "roles" claim into Spring Security authorities with the "ROLE_" prefix.
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Specify exactly which frontend origins can access your backend APIs
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Define allowed HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Define allowed headers
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));

        // Expose headers if your frontend needs access to them (e.g., custom headers, pagination headers)
        configuration.setExposedHeaders(List.of("Authorization"));

        // Set to true if your frontend needs to pass credentials (cookies, HTTP basic auth, etc.)
        configuration.setAllowCredentials(true);

        // How long the response to a preflight request can be cached in seconds (1 hour)
        configuration.setMaxAge(3600L);

        // Apply this configuration to all paths in the application
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
