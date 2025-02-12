// import axios from 'axios';
// import { setCookie, getCookie } from './cookie';

// // 기본 axios 인스턴스 설정
// const api = axios.create({
//   baseURL: 'https://yourapi.com',
//   timeout: 10000,
// });

// // 로그인 후 토큰 저장
// export const login = async (username, password) => {
//   try {
//     const response = await api.post('/login', { username, password });
//     const token = response.data.token; // 예시로, 응답에서 토큰을 받아오는 경우
//     await setCookie('token', token); // 받은 토큰을 AsyncStorage에 저장
//     return response;
//   } catch (error) {
//     console.error('로그인 실패:', error);
//   }
// };

// // 인증이 필요한 API 요청 예시
// export const fetchUserData = async () => {
//   try {
//     const token = await getCookie('token'); // AsyncStorage에서 토큰을 가져옴
//     const response = await api.get('/user/data', {
//       headers: {
//         Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('데이터 가져오기 실패:', error);
//   }
// };