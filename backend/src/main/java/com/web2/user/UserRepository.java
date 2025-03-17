package com.web2.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

    // 로그인 , 회원가입 기능을 구현할 예정임
    Optional<User> findByNickname(String nickname); // 이름을 굳이 적을 필요가 없어 중복 닉네임을 조사하기 위함
    Optional<User> findByEmail(String email); // 회원가입이 중복 이메일 여부 확인을 위함
    Optional<User> findByEmailAndPassword(String email, String password); // 로그인 시 서로 쌍을 이루는 이메일 비밀번호 확인용

}
