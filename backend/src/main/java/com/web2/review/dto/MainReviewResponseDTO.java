package com.web2.review.dto;

import java.util.List;

//위치 기반 음식점 검색에 이용
public record MainReviewResponseDTO(List<RestaurantReviewDTO> reviews, double averageRating, int reviewCount) {
}
