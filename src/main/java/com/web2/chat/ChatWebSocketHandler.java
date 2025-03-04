package com.web2.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket 핸들러 클래스
 * WebSocket을 통해 클라이언트 간의 메시지를 주고받는 로직 처리
 */

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatService chatService;
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(ChatService chatService) {
        this.chatService = chatService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userNickname = (String) session.getAttributes().get("userNickname");
        if (userNickname != null) {
            sessions.put(userNickname, session);
            System.out.println("연결된 사용자: " + userNickname);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 메시지 내용을 JSON 형식으로 파싱
        Map<String, String> messageData = new ObjectMapper().readValue(message.getPayload(), Map.class);
        String sender = messageData.get("sender");
        String recipient = messageData.get("recipient");
        String content = messageData.get("content");

        // 데이터베이스에 메시지 저장
        chatService.saveMessage(sender, recipient, content);

        // 수신자에게 메시지 전송
        WebSocketSession recipientSession = sessions.get(recipient);
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.sendMessage(new TextMessage(message.getPayload()));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userNickname = (String) session.getAttributes().get("userNickname");
        sessions.remove(userNickname);
    }
}
