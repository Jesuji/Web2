//npm install @react-native-async-storage/async-storage

// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 쿠키 저장 (AsyncStorage에 저장)
// export const setCookie = async (name, value) => {
//   try {
//     await AsyncStorage.setItem(name, value);
//   } catch (error) {
//     console.error('AsyncStorage에 쿠키 저장 실패:', error);
//   }
// };

// // 쿠키 읽기 (AsyncStorage에서 읽기)
// export const getCookie = async (name) => {
//   try {
//     const value = await AsyncStorage.getItem(name);
//     return value;
//   } catch (error) {
//     console.error('AsyncStorage에서 쿠키 읽기 실패:', error);
//   }
// };

// // 쿠키 삭제 (AsyncStorage에서 삭제)
// export const removeCookie = async (name) => {
//   try {
//     await AsyncStorage.removeItem(name);
//   } catch (error) {
//     console.error('AsyncStorage에서 쿠키 삭제 실패:', error);
//   }
// };