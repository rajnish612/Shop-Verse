package com.server.server.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;


//Custom api response exception
@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus httpStatus;

    public ApiException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

}
