import { postSignIn, postSignOut } from './api';
import CookieManager from '@react-native-cookies/cookies';
import { API_BASE_URL } from './config';


// 로그인 로직
export const login = async (email, password, setUser) => {
  try {
    // 로그인 요청
    const response = await postSignIn({ email, password });

    // 로그인 성공 후 쿠키 가져오기
    const cookies = await CookieManager.get(API_BASE_URL);
    const sessionId = cookies['SESSION_ID']?.value;

    if (sessionId) {
      console.log('세션 쿠키 저장 성공');
      // 세션 쿠키는 자동으로 관리, 별도 처리 필요 x
    }

    setUser({ ...response.data, nickname: response.data.nickname });

    return response.data;  // 로그인 성공 후 서버 응답 데이터 반환
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};

// 로그아웃 로직
export const logout = async (setUser) => {
  try {
    // 로그아웃 요청
    await postSignOut(); //세션 ID를 기반으로 처리되기 때문에 이메일과 비밀번호가 필요 없을 수도

    // 쿠키 삭제
    await CookieManager.clearAll();
    setUser(null);

    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};