import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { postSignUp, postSignIn } from '../services/api';
import InputField from '../components/InputField';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../contexts/UserContext';

function SignUpScreen() {
  const [nickname, setNickname] = useState('');
  const [nationality, setNationality] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const nav = useNavigation();
  const { setUser } = useUser();

  //1.	회원가입 필드 검사
  const validateEmail = (email) => {const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);};

  const handleSignUp = async () => {
    if (!nickname || !nationality || !age || !email || !password || !passwordConfirm) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }
    if (!validateEmail(email)) {
        Alert.alert('오류', '잘못된 이메일 형식입니다.');
        return;
      }
    if (password.length < 8) {
      Alert.alert('오류', '비밀번호는 8자리 이상이어야 합니다.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    //2.	회원가입 요청
    try {
        const response = await postSignUp({
          nickname,
          nationality,
          age: Number(age),
          email,
          password
        });
  
        if (response && response.status === 200) {

          //3.	닉네임 저장
          setUser({ ...response.data, nickname: response.data.nickname });
  
          //4. 자동 로그인 (로그인 생략)
          const loginResponse = await postSignIn({ email, password });
  
          if (loginResponse && loginResponse.status === 200) {
            Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
            nav.navigate('Home');
          }
        }
      } catch (error) {
        if (error.response) {
          // 중복된 닉네임
          if (error.response.status === 409) {
            Alert.alert('오류', '이미 사용 중인 이메일 또는 닉네임입니다.');
          }
          // 공란이 있을 경우
          else if (error.response.status === 400) {
            Alert.alert('오류', '모든 필드를 입력해주세요.');
          }
          // 기타 서버 오류
          else {
            Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
          }
        } else {
          Alert.alert('오류', '네트워크 오류가 발생했습니다.');
        }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

      <InputField
        placeholder="닉네임"
        value={nickname}
        onChangeText={setNickname}
      />
      <InputField
        placeholder="국적"
        value={nationality}
        onChangeText={setNationality}
      />
      <InputField
        placeholder="나이"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <InputField
        placeholder="이메일"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <InputField
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <InputField
        placeholder="비밀번호 확인"
        secureTextEntry={true}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 35,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 45,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#d3a26e',
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;