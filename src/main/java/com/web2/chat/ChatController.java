package com.web2.chat;

import com.web2.chat.dtos.ChatMessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * 채팅 페이지 접근 제어
 * 로그인한 사용자만 /chat 경로에 접근 가능하도록 설정
 */
@RestController
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageDTO>> getMessages(
            @RequestParam String senderNickname,
            @RequestParam String recipientNickname) {
        List<ChatMessageDTO> messages = chatService.getMessagesBetween(senderNickname, recipientNickname);
        return ResponseEntity.ok(messages);
    }


    @PostMapping("/messages")
    public ResponseEntity<Void> sendMessage(
            @RequestBody ChatMessageDTO chatMessageDTO) {
        chatService.saveMessage(
                chatMessageDTO.getSenderNickname(),
                chatMessageDTO.getRecipientNickname(),
                chatMessageDTO.getContent()
        );
        return ResponseEntity.ok().build();
    }
}