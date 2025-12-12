package com.example.smart_farming_iot.exception;

public class FarmNotFoundException extends RuntimeException {
    public FarmNotFoundException(String message) {
        super(message);
    }

    public FarmNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
