package com.server.server.exception;

import com.server.server.dto.ApiErrorResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;


@Slf4j
@RestControllerAdvice
public class GlobalException {

    // Common error response builder
    private ApiErrorResponseDTO buildErrorResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request
    ) {
        return ApiErrorResponseDTO.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
    }

    // 10. Disabled user account
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleDisabledException(
            DisabledException ex,
            HttpServletRequest request
    ) {
        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Please verify your email before logging in.",
                request
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    // 11. Invalid login credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request
    ) {
        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password.",
                request
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    // 1. Custom application exceptions
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleApiException(
            ApiException ex,
            HttpServletRequest request
    ) {
        HttpStatus status = ex.getHttpStatus();

        ApiErrorResponseDTO response = buildErrorResponse(
                status,
                ex.getMessage(),
                request
        );

        return ResponseEntity.status(status)
                .body(response);
    }

    // 2. DTO validation exceptions (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        String message = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request
        );

        return ResponseEntity.badRequest()
                .body(response);
    }

    // 3. Request parameter and path variable validation
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request
    ) {
        String message = ex.getConstraintViolations()
                .stream()
                .map(violation ->
                        violation.getPropertyPath() + ": " +
                                violation.getMessage()
                )
                .collect(Collectors.joining(", "));

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request
        );

        return ResponseEntity.badRequest()
                .body(response);
    }

    // 4. Invalid request parameter types
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request
    ) {
        String message = "Invalid value for parameter: " + ex.getName();

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request
        );

        return ResponseEntity.badRequest()
                .body(response);
    }

    // 5. Missing request parameters
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleMissingParameter(
            MissingServletRequestParameterException ex,
            HttpServletRequest request
    ) {
        String message = "Required parameter is missing: " + ex.getParameterName();

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request
        );

        return ResponseEntity.badRequest()
                .body(response);
    }

    // 6. Invalid JSON request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleInvalidRequestBody(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Invalid or malformed request body.",
                request
        );

        return ResponseEntity.badRequest()
                .body(response);
    }

    // 7. Database constraint violations
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request
    ) {
        log.warn("Database integrity violation: {}", ex.getMessage());

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.CONFLICT,
                "The operation could not be completed because it conflicts with existing data.",
                request
        );

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(response);
    }

    // 8. Entity not found
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleEntityNotFound(
            EntityNotFoundException ex,
            HttpServletRequest request
    ) {
        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    // 9. API endpoint/resource not found
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiErrorResponseDTO> handleResourceNotFound(
            NoResourceFoundException ex,
            HttpServletRequest request
    ) {
        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "The requested resource was not found.",
                request
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    // 10. Unexpected exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponseDTO> handleGlobalException(
            Exception ex,
            HttpServletRequest request
    ) {
        log.error("Unexpected error occurred at {}",
                request.getRequestURI(), ex);

        ApiErrorResponseDTO response = buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again later.",
                request
        );

        return ResponseEntity.internalServerError()
                .body(response);
    }
}