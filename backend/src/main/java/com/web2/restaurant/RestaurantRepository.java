package com.web2.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    //해시태그가 포함된 리뷰가 있는 음식점을 문자열 파싱해서 검색
    //distinct -> 리뷰에 해당 해시태그가 여러 번 포함되어 있더라도 중복된 음식점이 하나만 반환
    @Query("SELECT DISTINCT r FROM Restaurant r " +
           "JOIN r.reviews rev " +
           "WHERE rev.hashtags LIKE %:keyword% " +
           "AND (6371 * ACOS(COS(RADIANS(:latitude)) * COS(RADIANS(r.latitude)) * " +
           "COS(RADIANS(r.longitude) - RADIANS(:longitude)) + SIN(RADIANS(:latitude)) * " +
           "SIN(RADIANS(r.latitude)))) <= :radius")
    List<Restaurant> findRestaurantsByReviewHashtagsAndLocation(
            @Param("keyword") String keyword,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("radius") double radius);

    @Query(value = "SELECT *, "
            + "(6371 * acos(cos(radians(:latitude)) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(r.latitude)))) AS distance "
            + "FROM restaurant r "
            + "WHERE r.category LIKE %:userNationality% "  // 사용자 국적과 음식점 카테고리가 일치하는지 확인
            + "HAVING distance < :radius "
            + "ORDER BY distance", nativeQuery = true)
    List<Restaurant> findNearbyRestaurantsByCategory(@Param("latitude") double latitude,
                                                     @Param("longitude") double longitude,
                                                     @Param("radius") double radius,
                                                     @Param("userNationality") String userNationality);
}
