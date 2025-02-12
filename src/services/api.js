/* 백엔드 api */

const axios = require('axios');
const { API_BASE_URL } = require('./config');

// 공통 api 호출 함수
const request = async (method, endpoint, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error [${method.toUpperCase()} ${endpoint}]:`, error);
    throw error;
  }
};

// 회원가입 API
const postSignUp = ({nickname, nationality, age, email, password}) => {
  return request('post', '/auth/sign', {nickname, nationality, age, email, password});
};

const postSignIn  = ({email, password}) => {
  return request('post', '/auth/login', {email, password});
};


// 🍽️ 레스토랑 관련 API
const getRestaurants = () => {
  return request('get', '/restaurants');
};

const searchRestaurants = (query) => {
  return request('get', `/restaurants/search?keyword=${query}`);
};

const getRestaurantById = (id) => {
  return request('get', `/restaurants/${id}`);
};

// ✍️ 리뷰 관련 API
const getReveiw = (id) => {
  return request('get', `/restaurants/${id}/reviews`);
};

const postReview = (restaurantId, reviewData) => {
  return request('post', `/restaurants/${restaurantId}/reviews`, reviewData);
};

module.exports = { 
  postSignUp,
  postSignIn,
  getRestaurants,
  searchRestaurants,
  getRestaurantById,
  getReveiw,
  postReview 
};
