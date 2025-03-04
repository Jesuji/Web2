package com.web2.restaurant;

import com.web2.global.Aop.SecureEndPoint;
import com.web2.global.SessionService;
import com.web2.restaurant.dto.LocationRequest;
import com.web2.restaurant.dto.RestaurantDTO;
import com.web2.restaurant.dto.RestaurantDetailsDTO;
import com.web2.user.User;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final SessionService sessionService;

    //React native에서 JSON으로 사용자 위치 데이터(위도, 경도, 반경)를 전송해서 RequestBody로 받아 사용
    //반경 내의 음식점 리스트 다시 프론트로 반환 -> 네이버 지도 뷰에서 마커로 띄움.
    // 메인 화면에서 5km 이내 음식점 간단 조회
    @SecureEndPoint
    @PostMapping("/search/location")
    public List<RestaurantDTO> searchRestaurants(@RequestBody LocationRequest request,
                                                 HttpSession session,
                                                 @CookieValue(value = "SESSION_ID", required = false) String sessionId) {

        if (sessionId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No Session ID");
        }

        User user = sessionService.validateUser(session);

        double latitude = request.getLatitude();
        double longitude = request.getLongitude();
        double radius = request.getRadius();

        String userNationality = user.getNationality();

        return restaurantService.findRestaurantNearLocation(latitude, longitude, radius, userNationality);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RestaurantDetailsDTO>> searchByHashtag(@RequestParam String keyword) {
        List<RestaurantDetailsDTO> restaurantDTOS = restaurantService.searchRestaurant(keyword);
        return ResponseEntity.ok(restaurantDTOS);
    }

    // 음식점 세부정보 조회(리뷰는 개수만)
    @GetMapping("/{id}")
    public RestaurantDetailsDTO getRestaurantDetails(@PathVariable("id") Long id) {
        return restaurantService.getRestaurantDetails(id);
    }
}
