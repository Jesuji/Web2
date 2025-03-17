package com.web2.chat;

import com.web2.chat.dtos.ChatMessageDTO;
import com.web2.user.User;
import com.web2.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public List<ChatMessageDTO> getMessagesBetween(String senderNickname, String recipientNickname) {
        User sender = userRepository.findByNickname(senderNickname)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findByNickname(recipientNickname)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // 한 번의 쿼리로 양방향 메시지를 시간순으로 가져오기
        List<Message> messages = messageRepository.findMessagesBetweenUsers(sender, recipient);

        // ChatMessageDTO로 변환 후 반환
        return messages.stream()
                .map(message -> new ChatMessageDTO(
                        message.getSender().getNickname(),
                        message.getRecipient().getNickname(),
                        message.getContent()
                ))
                .collect(Collectors.toList());
    }

    public void saveMessage(String senderNickname, String recipientNickname, String content) {
        User sender = userRepository.findByNickname(senderNickname)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findByNickname(recipientNickname)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = new Message(sender, recipient, content);
        messageRepository.save(message);
    }
}
