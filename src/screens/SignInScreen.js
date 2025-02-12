import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Switch, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { postSignIn } from '../services/api';
import InputField from '../components/InputField';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isAutoLogin, setIsAutoLogin] = useState(false); // 자동 로그인 여부 상태

    const nav = useNavigation();
  
    // 이메일 형식 체크 함수
    const validateEmail = (email) => { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);};
  
    // // 앱 시작 시 자동 로그인 상태 확인
    // useEffect(() => {
    //   const checkAutoLogin = async () => {
    //     const savedAutoLogin = await AsyncStorage.getItem('isAutoLogin');
    //     const savedEmail = await AsyncStorage.getItem('email');
    //     const savedPassword = await AsyncStorage.getItem('password');
        
    //     if (savedAutoLogin === 'true' && savedEmail && savedPassword) {
    //       // 자동 로그인 정보가 있으면 로그인 처리
    //       handleLogin(savedEmail, savedPassword, true);
    //     }
    //   };
  
    //   checkAutoLogin();
    // }, []);
  
    // 로그인 처리 함수 (서버로 이메일과 패스워드 보내기)
    const handleLogin = async (loginEmail, loginPassword, autoLogin = false) => {
      const userEmail = autoLogin ? loginEmail : email;
      const userPassword = autoLogin ? loginPassword : password;
  
      
      // 이메일과 비밀번호 유효성 검사
      if (!userEmail || !userPassword) {
        Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
        return;
      }
      if (!userEmail) {
        Alert.alert('오류', '이메일을 입력해주세요.');
        return;
      }
      if (!validateEmail(userEmail)) {
        Alert.alert('오류', '올바른 이메일 형식이 아닙니다.');
        return;
      }
      if (!userPassword) {
        Alert.alert('오류', '비밀번호를 입력해주세요.');
        return;
      }
     
  
      try {
        const response = postSignIn(
           { userEmail, userPassword},
           { withCredentials: true }
          );
  
        console.log('서버 응답:', response.data);
  
        if (response.status === 200) {
          // 로그인 성공 시 처리
          const { nickname : myname } = response.data;
  
          
  
          // // 자동 로그인이 활성화되어 있으면 정보 저장
          // if (isAutoLogin) {
          //   await AsyncStorage.setItem('email', userEmail);
          //   await AsyncStorage.setItem('password', userPassword);
          //   await AsyncStorage.setItem('isAutoLogin', 'true');
          // } else {
          //   await AsyncStorage.removeItem('email');
          //   await AsyncStorage.removeItem('password');
          //   await AsyncStorage.setItem('isAutoLogin', 'false');
          // }
  
          // 로그인 성공 처리
          Alert.alert('로그인 성공', '로그인이 완료되었습니다.');
          nav.navigate('Home');  // 로그인 후 메인 화면으로 이동
        }
      } catch (error) {
        console.log('오류 상세:', error); 
        if (error.response) {
          if (error.response.status === 401) {
            // 401 오류 처리 (가입하지 않았거나 틀린 아이디 비밀번호)
            Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
          } else if (error.response.status === 500) {
            // 500 오류 처리 (형식에 맞지 않거나 서버 오류)
            Alert.alert('서버 오류', '서버에 문제가 발생했습니다. 다시 시도해주세요.');
          } else {
            // 기타 오류 처리
            Alert.alert('에러', '로그인 중 문제가 발생했습니다.');
          }
        } else {
          // 네트워크 오류 또는 기타 오류 처리
          Alert.alert('네트워크 오류', '서버에 연결할 수 없습니다.');
        }
      }
    };
  
    const toggleAutoLogin = () => {
      setIsAutoLogin(!isAutoLogin); // 자동 로그인 토글
    };
  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: '50%', height: '55' }}
            resizeMethod='contain'
          />
          <Text style={styles.title}>nom:ad</Text>
          <Text style={styles.subtitle}>고향의 맛을 찾아 떠도는 {'\n'}당신을 위한 가이드</Text>
          
          <InputField
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          />
          
          <InputField
            placeholder="패스워드"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
  
          {/* 자동 로그인 토글 */}
          <View style={styles.autoLoginContainer}>
            <View style={styles.autoLoginTextContainer}>
              <Text style={styles.autoLoginText}>자동 로그인</Text>
            </View>
            <Switch
              value={isAutoLogin}
              onValueChange={toggleAutoLogin}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isAutoLogin ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={() => handleLogin(email, password)}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      padding: 35,
      marginTop: 55,
    },
    title: {
      fontSize: 40,
      color: '#000000',
      letterSpacing: 4,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#000000',
      marginBottom: 40,
      textAlign: 'center',
    },
    errorText: {
      color: 'red',
      marginBottom: 20,
    },
    autoLoginContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    autoLoginTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10, // 텍스트와 스위치 사이에 간격 추가
    },
    autoLoginText: {
      fontSize: 15,
      fontWeight: '800',
      color: 'lightgray',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#D4B08C',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 40,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
  
  });
  
  export default SignInScreen;
  