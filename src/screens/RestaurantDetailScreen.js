import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
//import { getRestaurantById } from '../services/api';
import { getReveiw } from '../services/api';

import { dummySearchResults, dummyReviewResults } from '../dummy';

const RestaurantDetail = ({route}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { restaurantId } = route.params;

  useEffect(() => {
    const fetchRestaurantDetails = () => {
      try {
        setLoading(true);
        // 레스토랑 정보 가져오기
        const foundRestaurant = dummySearchResults.find(
            (item) => item.id === restaurantId
          );
  
          // 해당 레스토랑에 대한 리뷰 필터링
          const foundReviews = dummyReviewResults.reviews.filter(
            (reviews) => reviews.restaurantId === restaurantId
          );

        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
          setReviews(foundReviews);
        } else {
          setError('식당 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('식당 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

//   useEffect(() => {
//     const fetchRestaurantDetails = async () => {
//       try {
//         setLoading(true);
//         const responseId = await getRestaurantById();  // API 호출
//         setRestaurant(responseId);  // 받은 데이터 설정
//          const responseReview = await getReview();
//          setReview(responseReview);
//       } catch (err) {
//         setError('식당 정보를 가져오는 데 실패했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRestaurantDetails();
//   }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>식당 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.category}>{restaurant.category}</Text>
      <Text style={styles.address}>{restaurant.address}</Text>
      <Text style={styles.weekdays}>평일 운영시간: {restaurant.weekdays}</Text>
      <Text style={styles.weekend}>주말 운영시간: {restaurant.weekend}</Text>
      <Text style={styles.rating}>평점: {restaurant.averageRating}</Text>
      <Text style={styles.reviewCount}>리뷰 수: {restaurant.reviewCount}</Text>

      <Text style={styles.reviewTitle}>노마드 리뷰 📝</Text>
      <Text>nom:ad 사용자들의 생생한 리뷰에요 :)</Text>
      <ScrollView style={styles.reviewSection}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewNickname}>{review.nickName} ({review.nationality})</Text> 
                <Text style={styles.reviewRating}>⭐ {review.rating}</Text>
            </View>
              <Text>{review.message}</Text>
              {review.imageURL && (
                <Image source={{ uri: review.imageURL }} style={styles.reviewImage} />
              )}
              <Text>{review.createdAt} 작성됨</Text>
            </View>
          ))
        ) : (
          <Text>리뷰가 없습니다.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 25,
      backgroundColor: '#fff',
    },
    name: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 13,
    },
    category: {
      fontSize: 18,
      color: '#888',
      marginBottom: 20,
    },
    address: {
      fontSize: 16,
      marginBottom: 5,
    },
    weekdays: {
      fontSize: 16,
      marginBottom: 5,
    },
    weekend: {
      fontSize: 16,
      marginBottom: 3,
    },
    rating: {
      fontSize: 16,
      marginBottom: 3,
    },
    reviewCount: {
      fontSize: 16,
      marginBottom: 5,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reviewSection: {
      marginTop: 20,
    },
    reviewTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 15,
    },
    reviewItem: {
      backgroundColor: '#f9f9f9',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      gap: 3,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'center',
    },
    reviewNickname:{
        fontWeight: 'bold',
        fontSize: 15,
    },
    reviewRating:{
        fontWeight: 'bold',
        fontSize: 15,
    },
    reviewImage: {
      width: '100%',
      height: 200,
      marginTop: 10,
      borderRadius: 8,
    },
  });

export default RestaurantDetail;