package com.web2.restaurant;

import com.web2.global.google.GooglePlacesService;
import com.web2.global.s3.S3Service;
import com.web2.restaurant.dto.RestaurantDTO;
import com.web2.restaurant.dto.RestaurantDetailsDTO;
import com.web2.review.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final GooglePlacesService googlePlacesService;
    private final S3Service s3Service;

    public List<RestaurantDTO> findRestaurantNearLocation(double latitude, double longitude, double radius, String userNationality) {
        List<Restaurant> restaurants = restaurantRepository.findNearbyRestaurantsByCategory(latitude, longitude, radius, userNationality);
        DecimalFormat df = new DecimalFormat("#.##");

        return restaurants.stream()
                .map(restaurant -> {
                    // 현재 위치에서 음식점까지의 거리 계산
                    double distance = calculateDistance(latitude, longitude, restaurant.getLatitude(), restaurant.getLongitude());
                    String formattedDistance = df.format(distance);

                    // Google Places API로 사진 가져오기
                    String photoReference = googlePlacesService.getPhotoReference(restaurant.getName(), restaurant.getAddress());
                    String photoUrl = (photoReference != null) ? googlePlacesService.getPhotoUrl(photoReference) : null;

                    System.out.println("photoUrl is " + photoUrl); // 로그로 photoUrl 확인

                    // S3에 사진 업로드
                    String s3ImageUrl = null;
                    if (photoUrl != null) {
                        try {
                            s3ImageUrl = s3Service.uploadFileFromUrl(photoUrl); // 사진 URL을 S3에 업로드
                            restaurant.setPhotoUrl(s3ImageUrl); // 업로드한 S3 이미지 URL을 restaurant에 설정
                        } catch (IOException e) {
                            e.printStackTrace();
                            throw new RuntimeException("S3 업로드 실패", e);
                        }
                    } else {
                        restaurant.setPhotoUrl(null);
                    }

                    // 업데이트된 정보로 RestaurantDTO 생성
                    return new RestaurantDTO(
                            restaurant.getId(),
                            restaurant.getLatitude(),
                            restaurant.getLongitude(),
                            restaurant.getName(),
                            restaurant.getCategory(),
                            restaurant.getAddress(),
                            Double.parseDouble(formattedDistance),
                            restaurant.getReviews().size(),
                            calculateAverageRating(restaurant.getReviews()),
                            restaurant.getPhotoUrl()
                    );
                })
                .collect(Collectors.toList());
    }

    // 마커로 띄우고 누르면 restaurantId 기반으로 음식점 정보 상세 조회
    public RestaurantDetailsDTO getRestaurantDetails(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("음식점을 찾을 수 없습니다."));

        double averageRating = calculateAverageRating(restaurant.getReviews());
        int reviewCount = restaurant.getReviews().size();

        // Google Places API로 사진 가져오기
        String photoReference = googlePlacesService.getPhotoReference(restaurant.getName(), restaurant.getAddress());
        String photoUrl = photoReference != null ? googlePlacesService.getPhotoUrl(photoReference) : null;

        // S3에 사진 업로드
        String s3ImageUrl = null;
        try {
            s3ImageUrl = photoUrl != null ? s3Service.uploadFileFromUrl(photoUrl) : null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new RestaurantDetailsDTO(
                restaurant.getName(),
                restaurant.getCategory(),
                restaurant.getAddress(),
                restaurant.getWeekdays(),
                restaurant.getWeekend(),
                averageRating,
                reviewCount,
                s3ImageUrl
        );
    }

    //검색 키워드 기반으로 RestaurantDTO 반환
    public List<RestaurantDetailsDTO> searchRestaurant(String keyword) {
        String cleanKeyword = keyword.trim(); // 공백 제거
        List<Restaurant> restaurants = restaurantRepository.findRestaurantsByReviewHashtags(cleanKeyword);

        return restaurants.stream()
                .map(restaurant -> {
                    double averageRating = calculateAverageRating(restaurant.getReviews());
                    int reviewCount = restaurant.getReviews().size();

                    //검색할 때도 사진 추가해야 됨
                    String photoReference = googlePlacesService.getPhotoReference(restaurant.getName(), restaurant.getAddress());
                    String photoUrl = photoReference != null ? googlePlacesService.getPhotoUrl(photoReference) : null;
                    String imageUrl = null; // S3에 업로드하고 URL 반환
                    try {
                        imageUrl = photoUrl != null ? s3Service.uploadFileFromUrl(photoUrl) : null;
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                    return new RestaurantDetailsDTO(
                            restaurant.getName(),
                            restaurant.getCategory(),
                            restaurant.getAddress(),
                            restaurant.getWeekdays(),
                            restaurant.getWeekend(),
                            averageRating,
                            reviewCount,
                            imageUrl
                    );
                }).collect(Collectors.toList());
    }


    public Double calculateAverageRating(List<Review> reviews) {
        double average = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        //소수 첫째자리까지 반올림
        return Math.round(average * 10.0) / 10.0;
    }

    // Haversine 공식을 사용하여 거리 계산
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // 지구 반지름 (km)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                   + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                     * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // 거리 (km)
    }

    public void saveAll(List<Restaurant> restaurants) {
        restaurantRepository.saveAll(restaurants);
    }
}

