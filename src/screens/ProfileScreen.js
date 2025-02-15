import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/auth';



const recentReviews = [
  { id: '1', place: '종로도담', review: '고기가 맛있고 밥도 무료로 주셔서 다' },
  { id: '2', place: '종로도담', review: '고기가 맛있고 밥도 무료로 주셔서 다' },
  { id: '3', place: '종로도담', review: '고기가 맛있고 밥도 무료로 주셔서 다' }
];

function ProfileScreen({ nav }) {

  const { setUser } = useUser();

  const handleLogout = async () => {
    await logout(setUser); // 로그아웃 요청
    nav.navigate('SignIn'); // 로그인 화면으로 이동
};

  const renderItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewPlace}>{item.place}</Text>
      <Text style={styles.reviewText}>{item.review}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* 프로필 상단 */}
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
        <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.profileName}>{setUser}</Text>
          <Text style={styles.nicknameSuffix}> 님</Text> 
        </View> 
          <Text style={styles.profileCountry}>대한민국</Text>
          <Text style={styles.profileReviews}>리뷰 12</Text>
          <Text style={styles.profileStatus}>i love kimchi !!!! ❤️</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          {/* <Image source={require('../../assets/images/edit_icon.png')} style={styles.editIcon} /> */}
        </TouchableOpacity>
      </View>

      {/* 최근 작성한 리뷰 */}
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>최근 작성한 리뷰 12</Text>
        <FlatList
          data={recentReviews}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.reviewList}
        />
      </View>

      {/* 설정 및 메뉴 */}
      <View style={styles.menuSection}>
        <TouchableOpacity>
          <Text style={styles.menuItem}>프로필 편집</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.menuItem}>도움말</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.menuItem}>설정</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} >
          <Text style={styles.menuItem}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer: {
    height:'18%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',  // 프로필 배경 색상
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  avatar: {
    width: 70,
    height: 70,
    marginLeft: 10,
    marginRight: 20,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row', // 수평으로 배치
    alignItems: 'center', // 텍스트 세로 정렬
  },
  nicknameSuffix: {
    fontSize: 15,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileCountry: {
    fontSize: 15,
    color: '#888',
  },
  profileReviews: {
    fontSize: 15,
    color: '#888',
  },
  profileStatus: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 15,
  },
  reviewList: {
    marginBottom: 15,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 5,
  },
  reviewPlace: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  reviewText: {
    color: '#555',
  },
  menuSection: {
    marginTop: 5,
  },
  menuItem: {
    fontSize: 17,
    marginBottom: 40,
  },
});

export default ProfileScreen;