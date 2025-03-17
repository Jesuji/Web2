import React, { useState, useEffect }from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { getChatList } from '../services/api';


const ChatListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getChatList();
        const usersData = response.data;

        // 채팅 대상 유저 정보 추출
        const otherInfo = usersData.map(user => ({
          nickname: user.nickname,
          email: user.email,
          nation: user.nation,
        }));

        setUsers(otherInfo);
      } catch (error) {
        console.error('사용자 목록 가져오기 오류:', error);
      }
    };
    fetchUsers();
  }, []);


  const handlePress = (othername) => {
    navigation.navigate('Chat', { othername });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>채팅 목록</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.nickname}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.nickname)} style={styles.userItem}>
            <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
            <View>
              <Text style={styles.othername}>{item.nickname}</Text>
              <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
    userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  othername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#888',
  },
});

export default ChatListScreen;
