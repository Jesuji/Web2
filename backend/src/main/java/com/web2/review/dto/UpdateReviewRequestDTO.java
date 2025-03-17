package com.web2.review.dto;

//해시태그 추가
public record UpdateReviewRequestDTO(String message, int rating, String hashtags) {
}
