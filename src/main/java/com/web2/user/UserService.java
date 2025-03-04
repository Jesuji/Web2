package com.web2.user;

import com.web2.Exceptions.AuthenticationException;
import com.web2.Exceptions.DuplicateException;
import com.web2.Exceptions.UserNotFountException;
import com.web2.review.Review;
import com.web2.review.dto.MyReviewDTO;
import com.web2.user.dto.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 회원가입 시 중복된 이메일, 이름을 검사
    // 로그인 시에는 저장된 이메일과 패스워드 쌍이 일치하는 지 확인

    //회원가입 중복된 이메일, 이름을 검사하고 예외가 발생하지 않는다면 저장
    public ResponseUserDto sign(SignUser Dto) throws DuplicateException {

        checkNickname(Dto);
        checkEmail(Dto);
        save(Dto);

        return new ResponseUserDto(Dto.nickname()); // 프론트엔드에 닉네임을 전달하기 위함

    }
    // 로그인 기능 데이터베이스에 저장된 데이터와 DTO로 입력받은 데이터를 비교하여 로그인 성공 여부를 판단
    // 세션을 통한 로그인 기능을 구현할 것임, 그러므로 세션 ID를 넘겨주는 로직을 추가해야함

    // 중복을 잡아내야 함  그리고
    public String login(LoginUser Dto) throws AuthenticationException {
        // 사용자 정보 확인
        Optional<User> value = userRepository.findByEmailAndPassword(Dto.email(), Dto.password());

        if (value.isPresent()) {
            User user = value.get();
            return "로그인 성공";
        } else {
            throw new AuthenticationException("인증에 실패했습니다.");
        }
    }

    // 중복 로그인을 방지
    public String is_login(HttpSession session) throws AuthenticationException {

        if (session.getAttribute("userNickname") != null) {
            throw new AuthenticationException("이미 로그인 되어 있습니다");

        } else
            return "로그인 성공";
    }

    // 중복된 닉네임을 검사
    public void checkNickname(SignUser Dto) throws DuplicateException {
        Optional<User> value = userRepository.findByNickname(Dto.nickname());


        if (value.isPresent()) {
            throw new DuplicateException("nickname already exists");
        }
    }

    // 중복된 이메일을 검사
    public void checkEmail(SignUser Dto) throws DuplicateException {
        Optional<User> value = userRepository.findByEmail(Dto.email());
        /*value.orElseThrow(() -> new DuplicateException("email already exists"));*/

        if (value.isPresent()) {
            throw new DuplicateException("Email already exists");
        }
    }

    // 가입된 사용자를 데이터베이스에 저장하는 로직, 엔티티 변환과 분리함
    public void save(SignUser Dto) {
        User entity = toEntity(Dto);
        userRepository.save(entity);
    }

    // DTO로 전달받은 값을 엔티티로 변환, 원래는 생성자를 통해서 생성하는게 베스트
    // 근데 수정하려는 요청을 받았을 때 생성자를 통해서 만들면 put에 대해서는 상관이 없지만
    // patch의 경우에는...? 따로 그냥 메소드를 만들어 주는 게 낫지 싶다
    public User toEntity(SignUser Dto) {
        User entity = new User();
        entity.setNickname(Dto.nickname());
        entity.setEmail(Dto.email());
        entity.setPassword(Dto.password());
        entity.setNationality(Dto.nationality());
        entity.setAge(Dto.age());
        return entity;
    }

    @Transactional
    //해당 메서드가 호출되는 동안 Session이 열려 있어 lazy-loaded 데이터도 정상적으로 로드
    public UserDTO getprofile(User user) {
        List<Review> reviews = user.getReviewList();
        int reviewCount = reviews.size();

        return new UserDTO(
                user.getNickname(),
                user.getNationality(),
                user.getAge(),
                reviewCount
        );
    }

    public User mappingUser(LoginUser Dto) throws UserNotFountException {

        Optional<User> value = userRepository.findByEmail(Dto.email());
        if (value.isPresent()) {
            return value.get();  // 사용자가 존재하면 반환
        } else {
            // 사용자가 없을 경우 UserNotFoundException을 던짐
            throw new UserNotFountException("해당 이메일로 가입된 유저가 없습니다");
        }
    }

    public List<SimpleUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new SimpleUserResponse(user.getNickname(), user.getEmail())) // 필요한 필드만 포함
                .collect(Collectors.toList());

    }

    public List<MyReviewDTO> getMyReviews(User user) {
        return user.getReviewList().stream()
                .map(review -> new MyReviewDTO(
                        review.getId(),
                        review.getRestaurant().getName(),
                        review.getMessage(),
                        review.getRating()
                )).toList();
    }

}