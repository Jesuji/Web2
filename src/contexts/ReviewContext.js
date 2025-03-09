import React, { createContext, useContext, useState } from "react";
import { getMyReview, postReview, updateReview, deleteReview } from "../services/api";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]); // 리뷰 목록
    const [reviewCount, setReviewCount] = useState(0); // 리뷰 개수

    // ✅ 내가 쓴 리뷰 불러오기
    // ✅ 내가 쓴 리뷰 불러오기
    const fetchMyReviews = async () => {
        try {
            const response = await getMyReview(); // 내가 쓴 리뷰 가져오기
            setReviews(response.data || []);
            setReviewCount(response.data.length || 0); // 내 리뷰 개수 설정
        } catch (error) {
            console.error("내 리뷰 불러오기 실패:", error);
        }
    };

    // ✅ 리뷰 추가
    const addReview = async (restaurantId, reviewDTO) => {
        try {
        const response = await postReview(restaurantId, reviewDTO);
        const newReview = response.data; // 추가된 리뷰 데이터
        setReviews((prev) => [newReview, ...prev]); // 새 리뷰 추가
        setReviewCount((prev) => prev + 1);
        } catch (error) {
        console.error("리뷰 등록 실패:", error);
        }
    };

    // ✅ 리뷰 수정
    const editReview = async (reviewId, updateDTO) => {
        try {
        const response = await updateReview(reviewId, updateDTO);
        const updatedReview = response.data;
        setReviews((prev) =>
            prev.map((review) => (review.id === reviewId ? updatedReview : review))
        );
        } catch (error) {
        console.error("리뷰 수정 실패:", error);
        }
    };

    // ✅ 리뷰 삭제
    const removeReview = async (reviewId) => {
        try {
        await deleteReview(reviewId);
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        setReviewCount((prev) => Math.max(prev - 1, 0)); // 최소 0 유지
        } catch (error) {
        console.error("리뷰 삭제 실패:", error);
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, reviewCount, fetchMyReviews, addReview, editReview, removeReview }}>
          {children}
        </ReviewContext.Provider>
      );
    };
    
    export const useReview = () => {
      return useContext(ReviewContext);
    };