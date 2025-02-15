import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const nav = useNavigation();

  return (
    <View style={styles.header}>
      {/* 채팅 버튼 */}
      <TouchableOpacity style={styles.headerItem}  >
        <Image source={require('../../assets/images/chaticon.png')} style={styles.headerIcon} />
        <Text style={styles.headerText}>채팅</Text>
      </TouchableOpacity>

      {/* 홈 버튼 */}
      <TouchableOpacity style={styles.headerItem}  >
        <Image source={require('../../assets/images/homeicon.png')} style={styles.headerIcon} />
      </TouchableOpacity>

      {/* 프로필 버튼 */}
      <TouchableOpacity style={styles.headerItem} onPress={() => nav.navigate('Profile')} >
        <Text style={styles.headerText}>프로필</Text>
        <Image source={require('../../assets/images/profileicon.png')} style={styles.headerIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
      paddingVertical: 23,            // 위아래 패딩만 추가
      backgroundColor: '#fff',
      //alignItems: 'center',
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5,           // 양옆 여백
    },
    headerIcon: {
      marginHorizontal: 6,
    },
    headerText: {
      fontSize: 15,
      fontWeight: 'normal',
      color: 'black',
    },
  });
  
  export default Header;