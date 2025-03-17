package com.web2.chat.dtos;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

// 프론트로 메시지를 보낼 때 사용

@Getter
@Setter
@RequiredArgsConstructor
public class ChatMessageDTO {
    private String senderNickname;
    private String recipientNickname;
    private String content;

    public ChatMessageDTO(String senderNickname, String recipientNickname, String content) {
        this.senderNickname = senderNickname;
        this.recipientNickname = recipientNickname;
        this.content = content;
    }

}
