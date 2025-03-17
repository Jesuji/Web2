package com.web2.chat;

import com.web2.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender = :sender AND m.recipient = :recipient) " +
            "OR (m.sender = :recipient AND m.recipient = :sender) ORDER BY m.sentAt ASC")
    List<Message> findMessagesBetweenUsers(@Param("sender") User sender, @Param("recipient") User recipient);
}

