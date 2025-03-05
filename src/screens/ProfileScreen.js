import {React, useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/auth';
import { getMyProfile } from '../services/api';


function ProfileScreen({ navigation }) {

  const [profile, setProfile] = useState(null);

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await logout(setUser); // 로그아웃 요청
    navigation.navigate('SignIn');
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };

    fetchProfile();
  }, []);


  return (
    <View style={styles.container}>
      {/* 프로필 상단 */}
      <View style={styles.profileContainer}>
        <Image source={require('../../assets/images/profile.png')} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{user?.nickname}</Text>
            <Text style={styles.nicknameSuffix}> 님</Text>
          </View> 
          <Text style={styles.profileCountry}>{profile?.nationality ?? " null "}</Text>
          <Text style={styles.profileAge}>{profile?.age ?? " null "}세</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          {/* <Image source={require('../../assets/images/edit_icon.png')} style={styles.editIcon} /> */}
        </TouchableOpacity>

      </View>

      {/* 최근 작성한 리뷰 */}
      <TouchableOpacity style={styles.reviewSection}  onPress={()=> navigation.navigate('MyReview', { reviewCount: profile?.reviewCount })}>
          <Text style={styles.reviewTitle}>
            최근 작성한 리뷰 {profile?.reviewCount}</Text>
      </TouchableOpacity>

      

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
    height: '23%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',  // 프로필 배경 색상
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
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
    fontSize: 18,
  },
  profileCountry: {
    marginTop: 3,
    fontSize: 15,
    color: '#888',
  },
  profileAge: {
    marginTop: 2,
    fontSize: 15,
    color: '#888',
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  reviewSection: {
    padding: 10,
    marginBottom: 10,
  },
  reviewTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginVertical: 15,
  },
  menuSection: {
    marginTop: 10,
    padding: 10,
    gap: 10,
  },
  menuItem: {
    fontSize: 17,
    marginBottom: 40,
  },
});

export default ProfileScreen;