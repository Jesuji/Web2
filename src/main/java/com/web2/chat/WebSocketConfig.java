package com.web2.chat;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

/**
 * WebSocket 설정 클래스
 * WebSocket을 사용하기 위해 WebSocketConfigurer를 구현하며, 웹소켓 핸들러를 등록
 */

@Configuration // 스프링의 설정 클래스임을 정의
@EnableWebSocket // 웹소켓 기능을 활성화 gradle에도 설정 추가하기

public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;

    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler) {
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/ws/chat")
                .addInterceptors(new HttpSessionHandshakeInterceptor())  // HttpSession에서 WebSocketSession으로 전달
                .setAllowedOrigins("*");
    }
}
// registerWebSocketHandlers 핸들러, 인터셉터 , 허용 경로 설정을 위해 사용
// addhandler /ws/chat으로 접근했을 때 핸들러가 이를 처리
// WebSocketfigurer 웹소켓 핸들러와 경로를 지정하기 위해 사용하는 인터페이스
// addInterceptors 핸드셰이크 과정에서 http 세션 속성을 webSocketSession 세션으로 전달하는 과정
// 기존 http 속성을 webSocketSession 세션에서 사용할 수 있도록 함
// setAllowedOrigins 어떤 도메인에서든 접근 가능하도록 설정 CORS 설정

// 자바스크립트 코드에서 ws = new WebSocket("ws://localhost:8080/ws/chat"); 이런 형태로
// http://localhost:8080/chat에서 위 js 코드가 실행되면서 웹소켓 연결을 처리함