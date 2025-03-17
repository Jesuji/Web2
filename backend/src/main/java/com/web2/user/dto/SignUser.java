package com.web2.user.dto;

public record SignUser(
        String nickname,
        String email,
        String password,
        String nationality,
        Integer age) {
}

