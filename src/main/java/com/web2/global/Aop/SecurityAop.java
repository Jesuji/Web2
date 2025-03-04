package com.web2.global.Aop;

import com.web2.Exceptions.UnauthorizedException;
import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import java.lang.reflect.Parameter;

@Aspect
@Component
public class SecurityAop {

    @Around("@annotation(com.web2.global.Aop.SecureEndPoint)")  // @SecureEndpoint 붙은 메서드에만 적용
    public Object validateSecurity(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println(" Security Check START: " + joinPoint.toString());

        Object[] args = joinPoint.getArgs();  // 실행되는 메서드의 인자 가져오기
        HttpSession session = null;
        String sessionId = null;

        //  메서드의 인자 중에서 HttpSession과 sessionId를 찾아서 할당
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Parameter[] parameters = signature.getMethod().getParameters();

        for (int i = 0; i < parameters.length; i++) {
            if (parameters[i].getType() == HttpSession.class) {
                session = (HttpSession) args[i]; // 세션 할당
            } else if (parameters[i].getType() == String.class && parameters[i].getName().equals("sessionId")) {
                sessionId = (String) args[i]; // sessionId 할당
            }
        }

        //  세션이 없으면 예외 발생
        if (session == null) {
            throw new UnauthorizedException("세션 정보가 없습니다. 다시 로그인해주세요.");
        }

        //  세션 및 CSRF 토큰 검증
        validateSession(sessionId, session);
        validateCsrfToken(session);

        try {
            // 검증 통과 시 원래 메서드 실행
            return joinPoint.proceed();
        } finally {
            System.out.println(" Security Check END: " + joinPoint.toString());
        }
    }

    //  세션 검증 (sessionId와 session을 받아서 검증)
    private void validateSession(String sessionId, HttpSession session) {
        if (sessionId == null || !sessionId.equals(session.getId())) {
            throw new UnauthorizedException("잘못된 세션입니다. 다시 로그인해주세요.");
        }
    }

    // CSRF 토큰 검증 (세션을 받아서 검증)
    private void validateCsrfToken(HttpSession session) {
        String csrfToken = (String) session.getAttribute("csrfToken");
        if (csrfToken == null) {
            throw new UnauthorizedException("사용자 인증이 필요합니다.");
        }
    }
}


