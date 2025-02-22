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
const postMyLocation = (latitude, longitude, radius = 5) => {
  return api.post('/restaurants/search/location', {
    params: { latitude, longitude, radius }
  });
};

const getRestaurants = () => api.get('/restaurants');

const searchRestaurants = (query) => api.get(`/restaurants/search?keyword=${query}`);

const getRestaurantById = (id) => api.get(`/restaurants/${id}`);

// ✍️ 리뷰 관련 API
const getReview = (id) => api.get(`/restaurants/${id}/reviews`);

const postReview = (restaurantId, reviewData) => api.post(`/restaurants/${restaurantId}/reviews`, reviewData);


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
};
