import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import ReviewModal from '../components/ReviewModal';
import { useReview } from '../contexts/ReviewContext';

const MyReviewScreen = ({route}) => {
  const { reviewCount } = route.params;
  const { reviews, fetchMyReviews, editReview, removeReview } = useReview();
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('view');

  // 리뷰 목록 불러오기
  useEffect(() => {
    fetchMyReviews();
  }, []);

  // 리뷰 조회
  const handleView = (review) => {
    setSelectedReview(review);
    setMode('view');
    setModalVisible(true);
  };

  // 리뷰 수정
  const handleEdit = (review) => {
    setSelectedReview(review);
    setMode('edit');
    setModalVisible(true);
  };

  // 수정 제출버튼 클릭시
  const handleEditSubmit = async (reviewId, updateDTO) => {
      try {
      await editReview(reviewId, updateDTO);
      Alert.alert("수정이 완료되었습니다!");
    } catch (error) {
      console.error('리뷰 수정 실패:', error);
    }
    setModalVisible(false);
  };

  // 리뷰 삭제
  const handleDelete = async (reviewId) => {
    Alert.alert("삭제", "이 리뷰를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        onPress: async () => {
          try {
              await removeReview(reviewId);
              Alert.alert("삭제가 완료되었습니다!");
            }catch (error) {
            console.error("리뷰 삭제 실패:", error);
          }
        },
      },
    ]);
  };

  const renderRightActions = (review) => (
    <View style={styles.actionContainer}>
      <TouchableOpacity onPress={() => handleEdit(review)} style={styles.editButton}>
        <Text style={styles.actionText}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(review.id)} style={styles.deleteButton}>
        <Text style={styles.actionText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}> 총 {reviewCount} 개의 리뷰를 남겨주셨어요!</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleView(item)}>
        <Swipeable renderRightActions={() => renderRightActions(item)}>
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
            <Text style={styles.reviewRestaurant}>{item.name}</Text>
            <Text style={styles.reviewRating}>★{item.rating}</Text>
            </View>
            <Text style={styles.reviewText} numberOfLines={1} ellipsizeMode="tail">{item.message}</Text>
            </View>
            </Swipeable>
            </TouchableOpacity>
        )}
      />

      {modalVisible && (
        <ReviewModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={mode === 'edit' ? handleEditSubmit : undefined} //view, delete 모드에서는 동작안하게
          review={selectedReview}
          mode={mode}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 19,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    reviewItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginBottom: 10,
        gap: 5,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    reviewRestaurant: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
      fontSize: 15,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      actionText: {
        color: 'white',
        fontWeight: 'bold',
      },
      editButton: {
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '100%',
      },
      deleteButton: {
        backgroundColor: 'lightcoral',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: '100%',
      },
  });

export default MyReviewScreen;