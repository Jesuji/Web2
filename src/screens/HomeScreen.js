import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import RestaurantItem from '../components/RestaurantItem';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { postMyLocation, searchRestaurants } from '../services/api';

import Header from '../components/Header';

//import { dummyRestaurants} from '../dummy';


const HomeScreen = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const location = latitude && longitude ? { latitude, longitude, latitudeDelta: 0.045, longitudeDelta: 0.045 } : null;
  console.log(location);

  useEffect(() => {
    const getLocation = async () => {
      await geoLocation();
    };

    getLocation();

  }, []); // 의존성 배열을 빈 배열로 두어 한 번만 호출되게


  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = 35.479378341721;
        const lon = 128.75233566843;

        setLatitude(lat);
        setLongitude(lon);
        getRestaurants(lat, lon);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      };
      setRegion(newRegion);  // 위치가 바뀌면 region 업데이트
    }
  }, [latitude, longitude]);


   // 레스토랑 정보 받아오기
   const getRestaurants = (lat, lon) => {
    postMyLocation(lat, lon, 5)  // 5km 범위 레스토랑 가져오기
      .then((response) => {
        setRestaurants(response.data);  // 받아온 레스토랑 데이터 상태에 저장
      })
      .catch((error) => {
        console.error(error);
      });
  };


  // 검색어 필터링
  const filteredRestaurants = restaurants.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 검색어 상태가 변할 때 검색 모드 활성화
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);  // 검색어가 있으면 검색 모드로 전환
      searchRestaurants(query)  // searchRestaurants 호출
        .then((response) => {
          setRestaurants(response.data);  // 받아온 검색된 레스토랑 데이터 저장
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setIsSearching(false);  // 검색어가 없으면 기본 화면
    }
  };



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={[styles.container, isSearching && styles.searchingBackground]}>
        <Header/>
        <SearchBar
          placeholder="지금 먹고 싶은 고향 음식은?"
          value={searchQuery}
          onChange={handleSearch}
        />

      

      {isSearching ? (
          <>
        <Text style={styles.searchingText}></Text>
        
        {filteredRestaurants.length === 0 ? (
          <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
        ) : (
          <FlatList
            data={filteredRestaurants}
            renderItem={({ item }) => <RestaurantItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </>
        ) : (
          <>
            <View style={styles.mapContainer}>
              <MapView style={styles.map} region={region} onRegionChangeComplete={(region) => {
                setLatitude(region.latitude);
                setLongitude(region.longitude);
              }}>
                <Marker coordinate={region} title="내 위치" />

                {restaurants.map((restaurant) => (
                  <Marker
                    key={restaurant.id}
                    coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
                    title={restaurant.name}
                  />
                ))}
              </MapView>
            </View>

            <FlatList
              data={restaurants}
              renderItem={({ item }) => <RestaurantItem item={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
            <Button title="현재 위치로 보기" onPress={geoLocation} />
          </>
        )}

      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 17,
    },
    searchingText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',  // 검색 중일 때 텍스트 색상
      textAlign: 'center',
      marginVertical: 20,  // 위아래 여백 추가
    },
    noResultsText: {
      fontSize: 16,
      color: '#888',  // 검색 결과 없을 때 색상
      textAlign: 'center',
      marginTop: 20,
    },
    mapContainer: {
      height: 200,
      marginBottom: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    map: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
});

export default HomeScreen;