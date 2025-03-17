## 🌎 한국에서 가까운 자국 음식점을 쉽게 찾는 서비스 nomad


## 📎 프로젝트 개요
이 프로젝트는 한국을 방문한 외국인 여행자들이 반경 5km 이내에서 자국 음식을 판매하는 음식점을 손쉽게 찾을 수 있도록 도와주는 서비스입니다. 
- 사용자는 현재 위치를 기반으로 주변의 자국 음식점을 추천받을 수 있습니다.
- 추천받은 음식점의 상세 정보를 확인할 수 있습니다.
- 음식점 이용 후, 리뷰를 작성할 수 있습니다.
- 같은 국적의 사용자들끼리 소통할 수 있는 채팅 기능을 제공합니다.
  

<br>


## 📎 기획 배경 
한국을 방문하는 외국인 관광객들이 증가함에 따라, 현지 음식에 익숙하지 않거나 자국의 음식이 그리운 여행자들이 많아졌습니다. 하지만 원하는 음식을 파는 식당을 찾기 어렵거나 정보가 부족한 경우가 많습니다. 이를 해결하기 위해 위치 기반 추천 시스템을 활용하여 가까운 자국 음식점을 지도에 표시하여 편리하게 음식점을 찾을 수 있도록 본 프로젝트를 기획하였습니다. 또한, 리뷰 기능을 제공하여 방문한 음식점에 대한 실제 평가를 공유함으로써, 신뢰할 수 있는 정보를 제공하고 보다 만족스러운 식사 경험을 도울 수 있도록 만들었습니다.


<br> 


## ⭐️ 주요 기능

### 👤 회원가입 및 로그인(세션 기반 인증)
- 회원 가입
<img src="https://github.com/user-attachments/assets/4399880f-6eb9-414b-9915-878f2cdde433" height = 500>
<img src="https://github.com/user-attachments/assets/e36f97ae-f6f3-4feb-bde3-2a041e21e4d1" height = 500>


- 로그인
<img src="https://github.com/user-attachments/assets/1b83c78f-6993-4300-b635-cad113b7432f" height = 500>


<br>


### 📍 위치 기반 음식점 추천
- 회원가입 때 받은 국적을 활용
- 사용자의 현재 위치를 기반으로 반경 5km 내 자국 음식점 추천
- React Native Maps를 활용한 지도 표시


- #### 🇻🇳 베트남 음식점
<img src="https://github.com/user-attachments/assets/2e057893-93e5-4e55-ad32-87a7a64804ea" height = 500> 
<img src="https://github.com/user-attachments/assets/b37a9f7d-4709-4607-a8b5-8076af49101a" height = 500>


- #### 🇮🇹 이탈리아 음식점 
<img src="https://github.com/user-attachments/assets/ce4beab3-6811-4eff-ab62-0e66ea18c163" height = 500> 
<img src="https://github.com/user-attachments/assets/f5e3a90c-3555-49c0-973d-ef062477c8d8" height = 500>


<br>


### 📝 리뷰 작성 및 평점 시스템
- 방문한 음식점에 대한 리뷰 작성 및 별점 평가 기능

- #### 리뷰 작성
<img src="https://github.com/user-attachments/assets/aede1c44-8b3c-43f6-b3a1-26f19e1bcf5a" height = 500>
<img src="https://github.com/user-attachments/assets/6bbeadfa-b307-4d21-ad37-d31a313f45e4" height = 500>



- #### 프로필 -> 내 리뷰 조회 
<img src="https://github.com/user-attachments/assets/3be6cf4b-55e7-439d-bbfb-85c21b5135ef" height = 500>
<img src="https://github.com/user-attachments/assets/3f9b7f12-50d5-407a-8f0f-06ec29b89963" height = 500>



- #### 프로필 -> 리뷰 수정 및 삭제
<img src="https://github.com/user-attachments/assets/33c51711-b566-481b-8e1c-8a3b19d2c830" height = 500>
<img src="https://github.com/user-attachments/assets/c7a5680c-5e83-4163-91e7-b97c78987ac2" height = 500>


<br>


### 💬 채팅 기능 
<img src="https://github.com/user-attachments/assets/f51703a9-d894-4c64-8a67-3e7ec728e57e" height = 500>
<img src="https://github.com/user-attachments/assets/9785b271-8199-4bf0-94f7-db5b49fc41bd" height = 500>



<br>


### 🔍 검색 기능 (해시태그 기반 필터링)
- 음식점의 리뷰 내 해시태그 분석을 통해 검색 결과 제공
<img src="https://github.com/user-attachments/assets/a7f45eef-6276-495b-8ebd-512bee98b495" height = 500>
<img src="https://github.com/user-attachments/assets/28d1b9d6-ebe7-4651-b10c-977cdfe8f6f5" height = 500>


<br>


### 👤 프로필 조회 
<img src="https://github.com/user-attachments/assets/c88d24b5-bb52-4b39-bf52-d1864e448064" height = 500>


<br>


### 📷 음식점 사진 제공
- 🌎 **Google Places API**에서 음식점 사진을 가져와 표시
- ☁️ **AWS S3 bucket**에 저장하여 이미지 캐싱 및 최적화


<br> 


## 📕 활용 데이터 

-> https://www.bigdata-culture.kr/bigdata/user/data_market/detail.do?id=43de70c0-0337-11ee-a67e-69239d37dfae


<br> 


## 📕 API 명세서

-> https://desert-walker-411.notion.site/4e4ce146174148e6bf6000dd85e84647?v=9fb95dab867a410aa1123183f1a3934c&pvs=4


<br>


## 🛠 기술 스택
### 📌 Frontend
- React Native
- React Native Maps
- Axios


### 📌 Backend
- Spring Boot
- Spring Security (세션 기반 인증)
- JPA & MySQL
- Google Places API (음식점 정보 및 사진 제공)
- Amazon S3 (이미지 저장)


### 📌 Dev Tools & Test
- iOS Simulator
- Postman


<br> 


## 📌 고찰 
1️⃣ 초기에 네이버 지도 API를 사용했으나 React Native 환경에서의 호환성 문제로 React Native Maps로 변경하였습니다. 그러나 기본적으로 현재 위치를 자동으로 가져오지 않기 때문에 react-native-geolocation-service를 활용하여 위치 정보를 받아왔습니다. 하지만 GPS 신호가 약하거나 권한이 제한된 경우 정확도가 떨어지는 문제가 있어, 임시방편으로 프론트엔드에서 직접 위치를 지정하는 방식으로 연동하였습니다. 향후에는 사용자가 위치를 직접 설정할 수 있는 기능을 추가하여 보다 안정적인 검색이 가능하도록 개선할 계획입니다.


2️⃣ 일부 음식점에서 이미지 URL이 존재하지 않아 오류 발생하였고, Google Places API를 통해 찾은 photoUrl이 없을 경우, "대표 사진 없음"을 반환하는걸로 수정했습니다.


3️⃣ React Native에서 현재 위치를 가져오고 백엔드에 전송하는 과정에서 두 번 요청되는 문제가 발생했었는데, useEffect 내 의존성 배열 미설정으로 인해 중복 요청 발생하는게 원인이였고, useEffect에서 의존성 배열을 정확하게 설정하여 해결했습니다.


4️⃣ 초기에 음식점의 메뉴 정보가 있는 csv 데이터를 찾아보다가 없어서 사용자가 리뷰 작성 시 해시태그 형태로 먹었던 메뉴를 입력하도록 변경하여 이를 검색 기능에 활용하였습니다. 

5️⃣ 프론트엔드 코드와 머지를 할 때 잘못 설정된 프로젝트 구조에 문제가 생겨 현재 실행되지 않습니다. 추후에 실행되도록 업데이트하겠습니다. 

<br> 



### 🚀 향후 업데이트
- 다국어 지원(영어, 일본어, 베트남어 등)
- 리뷰 및 프로필 사진 업로드 기능 추가
- 사용자가 직접 위치를 설정할 수 있는 기능 추가 

<br>


### 🙋‍♂️ Developer


| Backend | Backend | Frontend | Frontend |
|---------|---------|---------|---------|
| [김명성](https://github.com/tomchaccom) | [제수지](https://github.com/Jesuji) | [안소윤](https://github.com/soyuniii) | [박준하](https://github.com/jh09-13) |
