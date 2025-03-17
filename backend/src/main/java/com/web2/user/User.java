package com.web2.user;

import com.web2.review.Review;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id") //실제 DB에서는 user_id 라고 한다는 뜻
    private Long id;

    private String email;  // @email
    private String password;

    private String nickname;
    private String nationality;
    /*private Boolean is_vegetarian;*/
    private Integer age;

    //만약 ReviewList가 항상 필요하다면 EAGER 추가
    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<Review> reviewList;
}
