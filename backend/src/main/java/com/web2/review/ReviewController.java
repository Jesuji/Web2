package com.web2.review;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web2.global.Aop.SecureEndPoint;
import com.web2.global.s3.S3Service;
import com.web2.global.SessionService;
import com.web2.restaurant.RestaurantRepository;
import com.web2.review.dto.*;
import com.web2.user.User;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final SessionService sessionService;
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final S3Service s3Service;

    @SecureEndPoint
    @PostMapping("/reviews/new")
    public ResponseEntity<CreateReviewResponseDTO> createReview(@RequestParam Long restaurantId,
                                                                @RequestPart("reviewDTO") String reviewDTOString,
                                               /*@RequestPart(value = "image", required = false) MultipartFile image,*/ //이미지 파일을 추가로 받음
                                                                HttpSession session,
                                                                @CookieValue(value = "SESSION_ID", required = false) String sessionId) {
        try {
            User user = sessionService.validateUser(session);
            // JSON 파싱: reviewDTOString을 JSON 문자열로 받아서 ReviewDTO 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            RestaurantReviewDTO reviewDTO = objectMapper.readValue(reviewDTOString, RestaurantReviewDTO.class);

            // 이미지 S3 업로드 로직 추가
/*
            String imageUrl = s3Service.uploadFile(image);  // 업로드 후 이미지 URL 반환
*/
            Review review = new Review(reviewDTO.message(), reviewDTO.rating(),
                    restaurantRepository.
getReferenceById(restaurantId), user, reviewDTO.hashtags());
            /*review.setImageUrl(imageUrl);  // 업로드한 이미지 URL을 리뷰에 설정*/
            reviewRepository.save(review);

            return ResponseEntity.ok(reviewService.createReview(review));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //restaurantId로 특정 음식점 리뷰 조회
    @GetMapping("/restaurants/{id}/reviews")
    public ResponseEntity<MainReviewResponseDTO> getReviews(@PathVariable Long id) {
        MainReviewResponseDTO reviewResponseDTOS = reviewService.getReviewList(id);
        return ResponseEntity.ok(reviewResponseDTOS);
    }

    @SecureEndPoint
    @PatchMapping("/reviews/update")
    public ResponseEntity<UpdateReviewResponseDTO> updateReview(@RequestParam Long reviewId,
                                                                @RequestPart("updateDTO") String updateDTOString,
                                               /*@RequestPart(value = "image", required = false) MultipartFile image,*/
                                               HttpSession session,
                                                                @CookieValue(value = "SESSION_ID", required = false) String sessionId) throws JsonProcessingException {
        User user = sessionService.validateUser(session);
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateReviewRequestDTO updateDTO = objectMapper.readValue(updateDTOString, UpdateReviewRequestDTO.class);

        /*String imageUrl = s3Service.uploadFile(image); */ // 업로드 후 이미지 URL 반환

        Review review = reviewService.updateReview(updateDTO, reviewId);
        reviewRepository.save(review);

        return ResponseEntity.ok(reviewService.updateResponse(review));
    }

    @SecureEndPoint
    @Transactional
    @DeleteMapping("/reviews/delete/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id,
                                               HttpSession session,
                                               @CookieValue(value = "SESSION_ID", required = false) String sessionId) {
        User user = sessionService.validateUser(session);
        /*if (user == session.getAttribute("user")) {
            reviewRepository.deleteById(id);
        }*/

        reviewRepository.deleteById(id);
        reviewRepository.flush();

        // 삭제 후 확인
        if (reviewRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("리뷰 삭제 실패");
        }

        //리뷰 삭제되면 S3 객체 사라지는 메서드 추가하기

        return ResponseEntity.ok("리뷰가 삭제되었습니다.");
    }

}
