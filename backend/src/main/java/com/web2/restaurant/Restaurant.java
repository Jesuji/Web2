package com.web2.restaurant;

import com.web2.review.Review;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Restaurant {

    @Id
    @GeneratedValue
    @Column(name = "restaurant_id")
    private Long id;

    private String name;
    private String category; //ex) 베트남, 이탈리아 등등
    private String city; // 시, 도추가
    private Double latitude;
    private Double longitude;
    private String address;
    private String weekdays;// 평일 운영 시간추가
    private String weekend;// 주말 운영 시간 추가
    private String photoUrl; // 대표 사진 URL

    @Column(name = "is_vegetarian")
    private Boolean vegetarian;

    @Column(name = "is_halal")
    private Boolean halal;

    @Column(name = "is_gluten_free")
    private Boolean glutenfree;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.REMOVE)
    private List<Review> reviews = new ArrayList<>();

}
