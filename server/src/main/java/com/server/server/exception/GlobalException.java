package com.server.server.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


//Global exception handler
@RestControllerAdvice
public class GlobalException {

    //Handle custom thrown api response exception
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<String> handleApiResponseException(
            ApiException ex) {

        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(ex.getMessage());
    }
}
