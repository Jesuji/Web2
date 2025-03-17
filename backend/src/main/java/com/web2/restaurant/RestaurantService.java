package com.web2.restaurant;

import com.web2.global.google.GooglePlacesService;
import com.web2.global.s3.S3Service;
import com.web2.restaurant.dto.RestaurantDTO;
import com.web2.restaurant.dto.RestaurantDetailsDTO;
import com.web2.review.Review;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final GooglePlacesService googlePlacesService;
    private final S3Service s3Service;
    private final DecimalFormat df = new DecimalFormat("#.##");

    public List<RestaurantDTO> findRestaurantNearLocation(double latitude, double longitude, double radius, String userNationality) {
        List<Restaurant> restaurants = restaurantRepository.findNearbyRestaurantsByCategory(latitude, longitude, radius, userNationality);

        return restaurants.stream()
                .map(restaurant -> convertToRestaurantDTO(restaurant, latitude, longitude))
                .collect(Collectors.toList());
    }


    // 마커로 띄우고 누르면 restaurantId 기반으로 음식점 정보 상세 조회
    public RestaurantDetailsDTO getRestaurantDetails(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("음식점을 찾을 수 없습니다."));

        return ReturnRestaurantDetails(restaurant);
    }


    // 검색 키워드 기반으로 RestaurantDTO 반환
    public List<RestaurantDTO> searchRestaurant(String keyword, double latitude, double longitude, double radius) {
        List<Restaurant> restaurants = restaurantRepository.findRestaurantsByReviewHashtagsAndLocation(keyword.trim(), latitude, longitude, radius);

        return restaurants.stream()
                .map(restaurant -> convertToRestaurantDTO(restaurant, latitude, longitude))
                .collect(Collectors.toList());
    }


    // RestaurantDTO 변환 중복 메서드
    private RestaurantDTO convertToRestaurantDTO(Restaurant restaurant, double latitude, double longitude) {
        double distance = calculateDistance(latitude, longitude, restaurant.getLatitude(), restaurant.getLongitude());
        String formattedDistance = df.format(distance);

        String imageUrl = getOrFetchImageUrl(restaurant);
        if (imageUrl == null || imageUrl.isEmpty()) {
            imageUrl = "대표 사진 없음"; // 기본 이미지 설정
        }

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
                imageUrl
        );
    }

    // 이미지 URL 가져오거나 새로 설정하는 메서드
    private String getOrFetchImageUrl(Restaurant restaurant) {
        String imageUrl = restaurant.getPhotoUrl();
        log.debug("기존 이미지 URL: {}", imageUrl);

        if(imageUrl == null || imageUrl.isEmpty()) {
            /*String photoReference = googlePlacesService.getPhotoReference(restaurant.getName(), restaurant.getAddress());
            String photoUrl = photoReference != null ? googlePlacesService.getPhotoUrl(photoReference) : null;
*/
            String photoReference = googlePlacesService.getPhotoReference(restaurant.getName(), restaurant.getAddress());
            if(photoReference != null) {
                String photoUrl = googlePlacesService.getPhotoUrl(photoReference);
                try {
                    imageUrl = s3Service.uploadFileFromUrl(photoUrl);
                    restaurant.setPhotoUrl(imageUrl);
                    restaurantRepository.save(restaurant);
                    log.info("S3에 업로드 완료: {}", imageUrl);
                } catch (IOException e) {
                    log.error("S3 업로드 실패", e);
                    imageUrl = "대표 사진 없음"; // 기본 이미지 설정
                }
            } else {
                log.warn("Google Places에서 유효한 photoUrl을 찾지 못함");
                imageUrl = "대표 사진 없음";
            }
        }
            return imageUrl;
    }

    // RestaurantDetails 변환 메서드
    public RestaurantDetailsDTO ReturnRestaurantDetails(Restaurant restaurant) {
        double averageRating = calculateAverageRating(restaurant.getReviews());
        int reviewCount = restaurant.getReviews().size();

        String imageUrl = getOrFetchImageUrl(restaurant);

        return new RestaurantDetailsDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getCategory(),
                restaurant.getAddress(),
                restaurant.getWeekdays(),
                restaurant.getWeekend(),
                averageRating,
                reviewCount,
                imageUrl
        );
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

