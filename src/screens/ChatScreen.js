import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Image, Alert, Platform} from 'react-native';
import {useUser} from '../contexts/UserContext';
import { getChatmessage, postChatmessage } from '../services/api';

const ChatScreen = ({ route, navigation }) => {

    const { user } = useUser();
    const myname = user.nickname;
    const { othername } = route.params;

    const ws = useRef(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
  

// ✅ WebSocket 연결
  useEffect(() => {

    fetchMessages();

    if (ws.current) {
        ws.current.close(); // 기존 WebSocket이 있으면 닫아줌
    }

    ws.current = new WebSocket(`ws://${Platform.OS === 'ios' ? 'localhost' : '10.0.2.2'}:8080/ws/chat?sender=${myname}&recipient=${othername}`);

    ws.current.onopen = () => console.log('WebSocket 연결 성공');

    ws.current.onmessage = (event) => {
      console.log('서버에서 받은 메시지:', event.data);
      const messageData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    ws.current.onerror = (error) => console.error('WebSocket 오류: ', error);

    ws.current.onclose = () => console.log('WebSocket 연결 종료');

    return () => {
        if (ws.current) {
            ws.current.close();
        }};
  }, [othername]);


    // ✅ 메시지 가져오기 (보낸+받은 메시지)
    const fetchMessages = async (type) => {
    try {
        const response = await getChatmessage({
            senderNickname: type === 'send' ? myname : othername,
            recipientNickname: type === 'receive' ? othername : myname,
        });

        const messages = response.data.map((message) => ({
            senderNickname: message.senderNickname,
            recipientNickname: message.recipientNickname,
            content: message.content,
          }));

        setMessages(prevMessages => [...prevMessages, ...messages]);
    } catch (error) {
        console.error('메시지 가져오기 오류:', error);
    }
    };


  // ✅ 메시지 전송
  const sendMessage = async() => {
    if (!message.trim()) return;

      const messageToSend = JSON.stringify({
        senderNickname: myname,
        recipientNickname: othername,
        content: message,
      });

      // WebSocket이 열려있는 경우에만 메시지 전송
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(messageToSend);
        console.log('보낸 메시지: ', messageToSend);
      } else {
        console.log('WebSocket이 열려있지 않음.');
      }

      // 서버에 메시지 저장 요청
      try {
        await postChatmessage(messageToSend);
    } catch (error) {
        console.error('메시지 저장 오류:', error);
        Alert.alert('오류', '메시지를 서버에 저장하는 데 문제가 발생했습니다.');
    }

     // 로컬에서 메시지 상태 업데이트 (전송 확인까지 기다리지 않음)
     setMessages((prevMessages) => [...prevMessages, messageToSend]);
     setMessage('');
    };

    // ✅ 메시지 렌더링
    const renderMessage = ({ item }) => (
        <View
          style={[
            styles.messageBubble,
            item.senderNickname === myname ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
        <View>
          <Text style={styles.nickname}>{othername}</Text>
          <Text style={styles.status}>대한민국</Text>
        </View>
      </View>
      
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={message}
          onChangeText={setMessage}
        />
        
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#b3e5fc',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
