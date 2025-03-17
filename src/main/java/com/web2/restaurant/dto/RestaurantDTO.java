package com.web2.restaurant.dto;

// 메인 화면에 띄울 음식점 간단 정보
// 이름, 카테고리, 주소, 현재 위치에서 거리, 리뷰 개수, 평점, 이미지
public record RestaurantDTO(Long id, double latitude, double longitude, String name, String category, String address, double distance,
                            int reviewCount, double averageRating, String imageUrl) {
}
