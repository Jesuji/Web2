import axios from 'axios';
import CookieManager from '@react-native-cookies/cookies';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// 요청 인터셉터: 요청 시 자동으로 쿠키 추가
api.interceptors.request.use(async (config) => {
  const cookies = await CookieManager.get(API_BASE_URL);
  const sessionId = cookies['SESSION_ID']?.value;
  if (sessionId) {
    config.headers['Cookie'] = `SESSION_ID=${sessionId}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 회원가입 API
const postSignUp = ({nickname, nationality, age, email, password}) => api.post('/auth/sign', {nickname, nationality, age, email, password});

// 로그인 API
const postSignIn = ({email, password}) => api.post('/auth/login', {email, password});

// 로그아웃 API
const postSignOut = () => api.post('/auth/logout');

// 프로필 조회 API
const getMyProfile = () => api.get('/my-profile');

// 🍽️ 레스토랑 관련 API
const postMyLocation = (latitude, longitude, radius) => {
  return api.post('/restaurants/search/location', {
    params: { latitude, longitude, radius }
  });
};

const getRestaurants = () => api.get('/restaurants');

const searchRestaurants = (query) => api.get(`/restaurants/search?keyword=${query}`);

const getRestaurantById = (restaurantId) => api.get(`/restaurants/${restaurantId}`);

// ✍️ 리뷰 관련 API
//내 리뷰목록 조회
const getMyReview = () => api.get('/my-reviews');
//레스토랑 리뷰 조회
const getReview = (restaurantId) => api.get(`/restaurants/${restaurantId}/reviews`);
//리뷰 작성
const postReview = (restaurantId, reviewDTO) => api.post(`/reviews/new?${restaurantId}`, reviewDTO);
//리뷰 수정
const editReview = (reviewId, reviewDTO) => api.patch(`/reviews/update/${reviewId}`, reviewDTO);
//리뷰 삭제
const deleteReview = (reviewId) => api.post(`/reviews/delete/${reviewId}`);




export { 
  postSignUp,
  postSignIn,
  postSignOut,
  getMyProfile,
  postMyLocation,
  getRestaurants,
  searchRestaurants,
  getRestaurantById,
  getReview,
  postReview,
  getMyReview,
  editReview,
  deleteReview
};
