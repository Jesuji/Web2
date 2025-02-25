import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
//import { getRestaurantById } from '../services/api';
import { getReview } from '../services/api';

import { dummyRestaurantDetail } from '../dummy';

const RestaurantDetail = ({route}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태 추가
  const [reviewText, setReviewText] = useState('');

  const { restaurantId } = route.params;

  const flatListRef = useRef(null);

  const scrollToReviews = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const submitReview = () => {
    console.log(`리뷰 등록! 식당 ID: ${restaurantId}, 내용: ${reviewText}`);
    setModalVisible(false); // 모달 닫기
    setReviewText(''); // 입력 필드 초기화
  };


  useEffect(() => {
    const fetchRestaurantDetails = () => {
      try {
        setLoading(true);
      // 레스토랑 정보 가져오기
      const foundRestaurant = dummyRestaurantDetail.find(
        (item) => item.id === restaurantId
      );

      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        // 해당 레스토랑에 대한 리뷰 설정
        setReviews(foundRestaurant.reviews || []); // reviews가 없으면 빈 배열로 설정
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
          <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} />
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
            <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
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

    {/* 리뷰 작성 모달 */}
    <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>리뷰 작성</Text>
            <TextInput
              style={styles.input}
              placeholder="노마드 이용자들에게 생생한 후기를 전달해주세요!"
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />
            <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
              <Text style={styles.submitText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContent: {
      width: '100%',
      height: '70%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',

      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 }, // 위쪽 방향으로 그림자
      shadowOpacity: 0.2, 
      shadowRadius: 10,
      elevation: 10,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 15,
    },
    closeText: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: '40%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      textAlignVertical: 'top',
    },
    submitButton: {
      marginTop: 20,
      backgroundColor: '#3498db',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 8,
    },
    submitText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

export default RestaurantDetail;