import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { getRestaurantById } from '../services/api';
import { postReview, getReview } from '../services/api';
import ReviewModal from '../components/ReviewModal';

//import { dummyRestaurantDetail } from '../dummy';

const RestaurantDetail = ({route}) => {
  const { restaurantId } = route.params;

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const flatListRef = useRef(null);
  const scrollToReviews = () => {
    if (flatListRef.current && flatListRef.current.props.data && flatListRef.current.props.data.length > 0) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  useEffect(() => {
    if (reviews.length > 0) {
      scrollToReviews(); // 리뷰가 업데이트된 후 스크롤
    }
  }, [reviews]);

  // useEffect(() => {
  //   const fetchRestaurantDetails = () => {
  //     try {
  //     // 레스토랑 정보 가져오기
  //     const foundRestaurant = dummyRestaurantDetail.find(
  //       (item) => item.id === restaurantId
  //     );

  //     if (foundRestaurant) {
  //       setRestaurant(foundRestaurant);
  //       setReviews(foundRestaurant.reviews || []); // reviews가 없으면 빈 배열로 설정
  //       } else {
  //         console.error('식당 정보를 찾을 수 없습니다.', error);
  //       }
  //     } catch (err) {
  //       console.error('식당 정보를 가져오는 데 실패했습니다.', error);
  //     } 
  //   };

  //   fetchRestaurantDetails();
  // }, [restaurantId]);

  
  useEffect(() => {
    const fetchRestaurantDetails = async() => {
      try {
      // 레스토랑 정보 가져오기
      const responseRestaurant = await getRestaurantById(restaurantId);
      setRestaurant(responseRestaurant.data);
      const responseReview = await getReview(restaurantId);
      setReviews(responseReview || []);

      } catch (error) {
        console.error('식당 정보를 가져오는 데 실패했습니다.', error);
      } 
    };

    fetchRestaurantDetails();
  }, [restaurantId]);


  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text>식당 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }
  return (

    <View style={{ flex: 1, backgroundColor: '#fff'}}>
    {/* 고정 헤더 */}
      <View style={styles.fixedHeader}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.category}>{restaurant.category}</Text>
      </View>

    <FlatList
      ref={flatListRef}
      data={reviews}
      initialNumToRender={5}   // 처음에 5개만 렌더링
      maxToRenderPerBatch={5}  // 한 번에 5개씩 추가 렌더링
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.container}>
          <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} resizeMode='cover'/>
          <Text style={styles.address}>📍 {restaurant.address}</Text>
          <Text style={styles.weekdays}>📍 평일 운영시간: {restaurant.weekdays}</Text>
          <Text style={styles.weekend}>📍 주말 운영시간: {restaurant.weekend}</Text>
          <Text style={styles.rating}>📍 평점: {restaurant.averageRating}</Text>
          <Text style={styles.reviewCount}>📍 리뷰 수: {restaurant.reviewCount}</Text>

          {/* 리뷰 보기 버튼 */}
          <View style={styles.reviewButton}>
          <TouchableOpacity style={styles.showReview}   onPress={() => setModalVisible(true)}>
            <Text style={styles.showReviewText}>리뷰작성</Text>
          </TouchableOpacity>

          <ReviewModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={async (reviewDTO) => {
              try {
                await postReview(restaurantId, reviewDTO);
                Alert.alert("리뷰 등록 완료!");
                // 해당 레스토랑 최신 리뷰 목록 불러오기 (지연방지)
                setTimeout(async () => {
                  const updatedReviews = await getReview(restaurantId);
                  setReviews(updatedReviews || []);
                }, 500);
              } catch (error) {
                Alert.alert("리뷰 등록 실패", error.message);
              }
              setModalVisible(false);
              scrollToReviews();
            }}
            review={null}
            mode="create"
          />

          <TouchableOpacity style={styles.showReview} onPress={scrollToReviews}>
            <Text style={styles.showReviewText}>리뷰보기</Text>
          </TouchableOpacity>
          </View>

        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewNickname}>{item.nickName} ({item.nationality})</Text>
            <Text style={styles.reviewRating}>★{item.rating}</Text>
          </View>
          <Text>{item.message}</Text>
          {item.imageURL && (
            <Image source={{ uri: item.imageURL }} style={styles.reviewImage} />
          )}
          <Text>{item.createdAt} 작성됨</Text>
        </View>
      )}
      style={{ marginTop: 100 }}
    />

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
    },
    fixedHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      padding: 25,
    },
    name: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    category: {
      fontSize: 18,
      color: '#888',
      marginBottom: 20,
    },
    restaurantImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
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
    reviewButton: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 60,
      padding: 10,
      marginTop: 50,
    },
    showReview: {
      backgroundColor: '#f9f9f9',
      padding: 10,
      paddingHorizontal: 40,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    showReviewText: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    reviewItem: {
      backgroundColor: '#f9f9f9',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      gap: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
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