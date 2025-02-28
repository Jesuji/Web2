import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { postReview, updateReview, getReview } from '../services/api';

const ReviewModal = ({ visible, onClose, onSubmit, restaurantId, reviewId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0); // ⭐ 별점 상태 추가
  const [hashtags, setHashtags] = useState([]); // 해시태그 상태
  const [tagInput, setTagInput] = useState(''); // 해시태그 입력 상태
  const [mode, setMode] = useState('create');
  const [existingReview, setExistingReview] = useState(null); //기존 리뷰 저장  

  const reviewDTO = {
    restaurantId: restaurantId,
    message: reviewText,
    rating: rating,
    hashtags: hashtags,
  };

  useEffect(() => {
    setReviewText('');
    setRating(0);
    setHashtags([]);
    setMode('create');
  
    if (reviewId) {
      setMode('edit');
      getReview(reviewId)
        .then((review) => {
          setExistingReview(review);
          setReviewText(review.message);
          setRating(review.rating);
          setHashtags(review.hashtags);
        })
        .catch((error) => console.error('리뷰 조회 실패:', error));
    }
  }, [reviewId]);

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        await postReview(reviewDTO);
      } else if (mode === 'edit') {
        await updateReview(reviewId, reviewDTO);
      }
      onSubmit(reviewText);
      setReviewText('');
      setRating(0);
      setHashtags([]);
    } catch (error) {
      console.error('리뷰 등록/수정 실패:', error);
    }
  };

  const renderTitle = () => {
    switch (mode) {
      case 'create':
        return '리뷰 작성';
      case 'edit':
        return '리뷰 수정';
      case 'view':
        return '리뷰 조회';
      default:
        return '리뷰 작성';
    }
  };

  const renderButtonText = () => {
    switch (mode) {
      case 'create':
        return '등록';
      case 'edit':
        return '수정';
      case 'view':
        return '확인';
      default:
        return '등록';
    }
  };
  

  // ⭐ 별점 선택 함수
  const selectRating = (star) => {
    setRating(star);
  };

  const addHashtag = () => {
    if (tagInput.trim() && !hashtags.includes(tagInput.trim())) {
      setHashtags([...hashtags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };


  return (
    <Modal visible={visible} animationType="slide" transparent>
        <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
        <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            keyboardShouldPersistTaps="handled"
        >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{renderTitle()}</Text>

        {/* 별점 선택 */}
        <View style={styles.starContainer} pointerEvents={mode === 'view' ? 'none' : 'auto'}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => selectRating(star)}>
              <Icon name="star" size={27} color={star <= rating ? '#FFD700' : '#ccc'} style={styles.starIcon} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 리뷰 텍스트 입력 */}
        <TextInput
        style={styles.input}
        placeholder="노마드 이용자들에게 생생한 후기를 전달해주세요!"
        multiline
        value={reviewText}
        onChangeText={setReviewText}
        editable={mode !== 'view'} // 조회 모드에서는 수정 불가능
      />

        {/* 해시태그 입력 */}
        <View style={styles.tagInputContainer} pointerEvents={mode === 'view' ? 'none' : 'auto'}>
          <TextInput
            style={styles.tagInput}
            placeholder="해시태그 추가 (#쌀국수, #맛집, #친절)"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addHashtag}
            editable={mode !== 'view'}
          />
          <TouchableOpacity onPress={addHashtag} style={styles.addTagButton} disabled={mode === 'view'}>
            <Text style={[styles.addTagText, mode === 'view' && { color: '#ccc' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 해시태그 리스트 */}
        <FlatList
          data={hashtags}
          horizontal
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <View style={styles.tag}>
              <Text style={styles.tagText}>#{item}</Text>
              {mode !== 'view' && (
                <TouchableOpacity onPress={() => removeHashtag(item)}>
                  <Text style={styles.removeTag}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
    </ScrollView>

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>{renderButtonText()}</Text>
          </TouchableOpacity>
        </View>

        </KeyboardAvoidingView>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        width: '100%',
        },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '96%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 13,
    right: 15,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
  },
  submitButtonContainer: {
    position: 'absolute', // 화면 하단에 고정되도록 설정
    bottom: 25, // 버튼을 화면 하단으로 위치
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    alignItems: 'center', // 가운데 정렬
  },
  submitButton: {
    marginTop: 5,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starIcon: {
    marginRight: 4,
  },
  // 🏷️ 해시태그 입력
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 15,
    width: '100%',
  },
  tagInput: {
    flex: 1,
    paddingVertical: 8,
  },
  addTagButton: {
    padding: 5,
  },
  addTagText: {
    fontSize: 20,
    color: '#007AFF',
  },
  // 🏷️ 추가된 해시태그 스타일
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 15,
    marginHorizontal: 5,
    height: 37,
    padding: 10,
  },
  tagText: {
    color: '#fff',
    marginRight: 5,
  },
  removeTag: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReviewModal;