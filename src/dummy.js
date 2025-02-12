  // 더미 레스토랑 데이터 (데이터가 없을 때 확인용)
  export const dummyRestaurants = [
    {
      id: 1,
      name: "ZAMZAM",
      category: "기타",
      address: "경기도 화성시 3.1만세로 1130",
      weekdays: "정보없음",
      weekend: "정보없음",
      averageRating: 5.0,
      reviewCount: 2,
    },
    {
      id: 2,
      name: "효자동쌀국수미",
      category: "베트남",
      address: "경상북도 포항시 남구 희망대로 1233",
      weekdays: "정보없음",
      weekend: "정보없음",
      averageRating: 5.0,
      reviewCount: 1,
    },
    // 더미 데이터 더 추가 가능
  ];

  export const dummySearchResults = [
    {
      id: 3,
      name: "효자동쌀국수미",
      category: "베트남",
      address: "서울시 강남구",
      weekdays: "09:00 - 18:00",
      weekend: "10:00 - 16:00",
      averageRating: 4.5,
      reviewCount: 10,
    },
    {
        id: 4,
        name: "ZAMZAM",
        category: "기타",
        address: "경기도 화성시 3.1만세로 1130",
        weekdays: "정보없음",
        weekend: "정보없음",
        averageRating: 5.0,
        reviewCount: 2,
      },
      {
        id: 5,
        name: "효자동쌀국수미",
        category: "베트남",
        address: "경상북도 포항시 남구 희망대로 1233",
        weekdays: "정보없음",
        weekend: "정보없음",
        averageRating: 5.0,
        reviewCount: 1,
      },
      {
        id: 6,
        name: "샘플레스토랑",
        category: "일식",
        address: "서울시 강남구",
        weekdays: "09:00 - 18:00",
        weekend: "10:00 - 16:00",
        averageRating: 4.5,
        reviewCount: 10,
      },
      {
        id: 7,
        name: "샘플레스토랑",
        category: "일식",
        address: "서울시 강남구",
        weekdays: "09:00 - 18:00",
        weekend: "10:00 - 16:00",
        averageRating: 4.5,
        reviewCount: 10,
      },
  ];

  export const dummyReviewResults = {
    "reviews": [
        {
            "restaurantId": 4,  // ZAMZAM의 ID
            "nickName": "foodie",
            "nationality": "인도",
            "message": "맛있어요!",
            "rating": 4,
            "createdAt": "2024-10-01-12:00",
            "updatedAt": "2024-10-01-12:30",
            "hashtags": "카레, 양고기",
            "imageURL": null
          },
        {
            "restaurantId": 2,
            "nickName": "test",
            "nationality": "베트남",
            "message": "?",
            "rating": 5,
            "createdAt": "2024-09-21-00:35",
            "updatedAt": "2024-09-29-00:36", //리뷰 마지막 수정 날짜
            "hashtags": "쌀국수, 짜조",
            "imageURL": null //사진을 안올렸단 뜻
        },
        {
            "restaurantId": 3,
            "nickName": "소윤",
            "nationality": "veitnam",
            "message": "여기 쌀국수 존맛탱!! 또 먹먹",
            "rating": 5,
            "createdAt": "2024-09-21-00:59",
            "updatedAt": "2024-09-30-22:10",
            "hashtags": "Spicy,베트남 음식",
            "imageURL": "https://cdn.pixabay.com/photo/2023/05/27/12/37/noodle-soup-8021417_1280.png" //프론트에서 이 URL 접근
        },
        {
            "restaurantId": 3,
            "nickName": "수지",
            "nationality": "veitnam",
            "message": "굿이에용",
            "rating": 4.5,
            "createdAt": "2024-09-21-00:59",
            "updatedAt": "2024-09-30-22:10",
            "hashtags": "Spicy,베트남 음식",
            "imageURL": "https://cdn.pixabay.com/photo/2023/05/27/12/37/noodle-soup-8021417_1280.png" //프론트에서 이 URL 접근
        },
        {
            "restaurantId": 3,
            "nickName": "명성",
            "nationality": "veitnam",
            "message": "여기 쌀국수 존맛탱",
            "rating": 5,
            "createdAt": "2024-09-21-00:59",
            "updatedAt": "2024-09-30-22:10",
            "hashtags": "Spicy,베트남 음식",
            "imageURL": "https://cdn.pixabay.com/photo/2023/05/27/12/37/noodle-soup-8021417_1280.png" //프론트에서 이 URL 접근
        },
        
    ],
    "averageRating": 5.0, //리뷰 평균 
    "reviewCount": 2 //리뷰 개수
}
