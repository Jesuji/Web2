package com.web2.restaurant.dto;

//음식점 상세 정보 조회에 이용
public record RestaurantDetailsDTO(Long id, String name, String category, String address, String weekdays, String weekend,
                                   double averageRating, int reviewCount, String imageUrl) {
}

