package com.web2.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id") //실제 DB에서는 foreign_member_id라고 한다는 뜻
    private Long id;

    private String email;
    private String password;

    private String nickname;
    private String nationality;
    private Boolean is_vegetarian;
    private Integer age;
    private Double longitude;
    private Double latitude;

}
