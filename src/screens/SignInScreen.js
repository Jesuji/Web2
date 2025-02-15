import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InputField from '../components/InputField';
import { login } from '../services/auth';
import { useUser } from '../contexts/UserContext';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const nav = useNavigation();
    const { setUser } = useUser();

    //1.	로그인 필드 검사
    const validateEmail = (email) => { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);};

    const handleLogin = async () => {

      if (!email || !password) {
        Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert('오류', '올바른 이메일 형식이 아닙니다.');
        return;
      }
      //2.	로그인 요청
      try {
        const response = await login(email, password, setUser);

        console.log('서버 응답:', response);

        if (response.status === 200) {
          Alert.alert('로그인 성공', '로그인이 완료되었습니다.');
          nav.navigate('Home');
        }
      } catch (error) {
        console.log('오류 상세:', error);
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 잘못되었습니다.');
      }
    };
  

  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
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
  
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toSignup} onPress={() => nav.navigate('SignUp')}>
            <Text style={styles.toSignupText}>회원가입</Text>
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
      marginTop: 70,
    },
    logo: {
      width: '50%',
      height: 55,
    },
    title: {
      fontSize: 40,
      color: '#000000',
      letterSpacing: 3,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: '#000000',
      marginBottom: 50,
      textAlign: 'center',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#D4B08C',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginTop: 70,
    },
    buttonText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    toSignup: {
      marginVertical: 20,
    },
    toSignupText: {
      color: '#000000',
      fontSize: 16,
    }
  
  
  });
  
  export default SignInScreen;
  