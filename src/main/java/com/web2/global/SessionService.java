package com.web2.global;

import com.web2.Exceptions.UnauthorizedException;
import com.web2.user.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    public User validateUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new UnauthorizedException("로그인 후 이용해주세요.");
        }
        return user;
    }
}
