import React, { createContext, useContext, useState, useEffect } from "react";
import { getMyReview, getReview, postReview, updateReview, deleteReview } from "../services/api";
import { useUser } from "../contexts/UserContext";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const { user } = useUser();
    const [myReviews, setMyReviews] = useState([]); // 내가 쓴 리뷰 목록
    const myReviewCount = myReviews.length;
    const [restaurantReviews, setRestaurantReviews] = useState({}); // 레스토랑별 리뷰 목록 (id별 저장)
    const getRestaurantReviewCount = (restaurantId) => {
        return restaurantReviews[restaurantId]?.length || 0;
    };

    useEffect(() => {
        if (user) {
            setMyReviews([]); // 유저 변경 시 초기화
            fetchMyReviews();
        }
    }, [user]);


    const fetchMyReviews = async () => {
        try {
            const response = await getMyReview();
            const sortedReviews = response.data.sort((a, b) => b.id - a.id); // 최신순 정렬
            setMyReviews(sortedReviews || []);
            console.log('fetchMyReviews', response.data);
        } catch (error) {
            console.error("내 리뷰 불러오기 실패:", error);
        }
    };

    const fetchRestaurantReviews = async (restaurantId) => {
        try {
            const response = await getReview(restaurantId);
            setRestaurantReviews((prev) => ({
                ...prev,
                [restaurantId]: response.data.reviews,
            }));
        } catch (error) {
            console.error("레스토랑 리뷰 가져오기 실패:", error);
        }
    };


    const addReview = async (restaurantId, reviewDTO) => {
        try {
            const response = await postReview(restaurantId, reviewDTO);
            const newReview = response.data;

            setMyReviews((prev) => [newReview, ...prev]); // 내 리뷰 목록 갱신
            setRestaurantReviews((prev) => ({
                ...prev,
                [restaurantId]: [...(prev[restaurantId] || []), newReview],
            })); // 해당 레스토랑의 리뷰 목록 갱신

        } catch (error) {
            console.error("리뷰 추가 실패:", error);
        }
    };

    const editReview = async (reviewId, updateDTO) => {
        try {
            const response = await updateReview(reviewId, updateDTO);
            const updatedReview = response.data;

            const restaurantId = updatedReview.restaurantId;

            setMyReviews((prev) =>
                prev.map((review) => (review.id === reviewId ? updatedReview : review))
            );
    
            setRestaurantReviews((prev) => ({
                ...prev,
                [restaurantId]: (prev[restaurantId] || []).map((review) =>
                    review.id === reviewId ? updatedReview : review
                ),
            }));
        } catch (error) {
            console.error("리뷰 수정 실패:", error);
        }
    };

    const removeReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);

            const restaurantId = myReviews.find((r) => r.id === reviewId)?.restaurantId;
            console.log('restaurantId',restaurantId);
    
            setMyReviews((prev) => prev.filter((review) => review.id !== reviewId));
            setRestaurantReviews((prev) => ({
                ...prev,
                [restaurantId]: prev[restaurantId].filter((review) => review.id !== reviewId),
            }));
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
        }
    };

    return (
        <ReviewContext.Provider
            value={{
                myReviews,
                setMyReviews,
                myReviewCount,
                restaurantReviews,
                getRestaurantReviewCount,
                fetchMyReviews,
                fetchRestaurantReviews,
                addReview,
                editReview,
                removeReview,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => {
    return useContext(ReviewContext);
};