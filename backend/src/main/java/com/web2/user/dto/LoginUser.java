package com.web2.user.dto;

// 로그인 시 필요한 정보를 받아오는 DTO

public record LoginUser(String email, String password) {
}
