import React from 'react';
import {Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RestaurantItem = ({ item }) => {
  const nav = useNavigation();

  const handlePress = () => {
    nav.navigate('RestaurantDetail', {restaurantId: item.id});
  };

  return(
    <TouchableOpacity 
  style={styles.container}
  onPress={handlePress}
  >
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.category}>{item.category}</Text>
    <Text style={styles.rating}>평점: {item.averageRating} (리뷰 {item.reviewCount})</Text>
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