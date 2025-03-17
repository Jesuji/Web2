package com.web2.review;

import com.web2.global.s3.S3Service;
import com.web2.restaurant.Restaurant;
import com.web2.restaurant.RestaurantRepository;
import com.web2.restaurant.RestaurantService;
import com.web2.review.dto.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantService restaurantService;
    private final ReviewRepository reviewRepository;
    private final S3Service s3Service;

    public MainReviewResponseDTO getReviewList(Long id) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");
        DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");

        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("음식점을 찾을 수 없습니다."));

        List<Review> reviews = restaurant.getReviews();

        List<RestaurantReviewDTO> reviewDTOS = restaurant.getReviews().stream()
                .map(review -> {
                    String nickname = review.getUser().getNickname();
                    String nationality = review.getUser().getNationality();
                    String createdAt = review.getCreatedAt().format(formatter);
                    String updatedAt = review.getUpdatedAt().format(formatter2);

                    return new RestaurantReviewDTO(
                            nickname,
                            nationality,
                            review.getMessage(),
                            review.getRating(),
                            createdAt,
                            updatedAt,
                            review.getHashtags(),
                            review.getImageUrl()
                    );
                }).collect(Collectors.toList());

        double averageRating = restaurantService.calculateAverageRating(restaurant.getReviews());
        int reviewCount = reviews.size();

        return new MainReviewResponseDTO(reviewDTOS, averageRating, reviewCount);
    }

    //리뷰 등록 반환 메서드
    @Transactional
    public CreateReviewResponseDTO createReview(Review review) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");
        return new CreateReviewResponseDTO(
                review.getId(),
                review.getRestaurant().getId(),
                review.getUser().getId(),
                review.getRestaurant().getName(),
                review.getRating(),
                review.getMessage(),
                review.getHashtags(),
                review.getCreatedAt().format(formatter)
        );
    }

    //리뷰 수정 메서드
    @Transactional
    public Review updateReview(UpdateReviewRequestDTO updateDTO,
                               Long reviewId
                               /*String newImageUrl*/) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을수 없습니다."));

        String message = updateDTO.message();
        int rating = updateDTO.rating();
        String hashtags = updateDTO.hashtags();

        //새로운 이미지가 있으면 기존 이미지를 삭제
        /*if(newImageUrl != null && !newImageUrl.isEmpty()) {
            String oldImageUrl = review.getImageUrl(); //수정되기 전 원래 리뷰 사진

        //기존 이미지가 있는 경우 S3에서 삭제
            if(oldImageUrl != null && !oldImageUrl.isEmpty()) {
                s3Service.deleteFileFromS3Bucket(oldImageUrl);
            }
            //새로운 이미지 URL 설정
            review.setImageUrl(newImageUrl);
        }*/

        review.setMessage(message);
        review.setRating(rating);
        review.setHashtags(hashtags);
        reviewRepository.save(review);

        return review;
    }

    // 리뷰 수정 반환 메서드
    @Transactional
    public UpdateReviewResponseDTO updateResponse(Review review) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");
        return new UpdateReviewResponseDTO(
                review.getId(),
                review.getRestaurant().getId(),
                review.getUser().getId(),
                review.getRestaurant().getName(),
                review.getRating(),
                review.getMessage(),
                review.getHashtags(),
                review.getUpdatedAt().format(formatter)
        );
    }


}
