package com.web2.Exceptions;

public class UserNotFountException extends RuntimeException {
    public UserNotFountException(String message) {
        super(message);
    }
}
