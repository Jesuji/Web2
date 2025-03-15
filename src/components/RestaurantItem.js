import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getRestaurantById } from '../services/api';
import { useReview } from '../contexts/ReviewContext';

const RestaurantItem = ({ item }) => {
  const nav = useNavigation();
  const [restaurant, setRestaurant] = useState(item);
  const { getRestaurantReviewCount } = useReview();
  const reviewCount = getRestaurantReviewCount(item.id); // 전역 레스토랑 리뷰수 가져오기

  const fetchRestaurantData = async () => {
    try {
      const response = await getRestaurantById(item.id);
      setRestaurant(response.data);
    } catch (error) {
      console.error('레스토랑 정보 가져오기 실패', error);
    }
  };

  // item.id가 변경될 때마다 데이터 새로 가져오기
  useEffect(() => {
    fetchRestaurantData();
  }, [item.id]);



  const handlePress = () => {
    nav.navigate('RestaurantDetail', {restaurantId: item.id});
  };

  return(
    <TouchableOpacity 
  style={styles.container}
  onPress={handlePress}
  >
    <Text style={styles.name}>{restaurant.name}</Text>
    <Text style={styles.category}>{restaurant.category}</Text>
    <Text style={styles.rating}>평점: {restaurant.averageRating} (리뷰 {reviewCount})</Text>
    <Text style={styles.distance}>거리: {item.distance}km</Text>
  </TouchableOpacity>
  );
  
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  address: {
    fontSize: 14,
    color: '#888',
    marginBottom: 1,
  },
  rating: {
    fontSize: 14,
    color: '#888',
  },
  distance: {
    fontSize: 14,
    color: '#888',
  },
});

export default RestaurantItem;