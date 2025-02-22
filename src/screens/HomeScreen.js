import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import RestaurantItem from '../components/RestaurantItem';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { postMyLocation } from '../services/api'; 

import Header from '../components/Header';

import { dummyRestaurants} from '../dummy';


const HomeScreen = () => {
  //const searchResults = useSearch(searchQuery, isSearchActive);
  const [searchQuery, setSearchQuery] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const location = latitude && longitude ? { latitude, longitude, latitudeDelta: 0.045, longitudeDelta: 0.045 } : null;


  console.log(location);
  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = 37.4979;  // 강남역 위도
        const lon = 127.0276;  // 강남역 경도

        setLatitude(lat);  // setLatitude에 숫자 그대로 넘기기
        setLongitude(lon); // setLongitude에 숫자 그대로 넘기기
        getRestaurants(lat, lon);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

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


  useEffect(() => {
    if (latitude && longitude) {
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.045,
        longitudeDelta: 0.045,
      };
      setRegion(newRegion);  // 위치가 바뀌면 region 업데이트
    }
  }, [latitude, longitude]);


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container}>
        <Header/>
        <SearchBar
          placeholder="지금 먹고 싶은 고향 음식은?"
          value={searchQuery}
          onChange={setSearchQuery}
          //onFocus={() => setIsSearchActive(true)}
        />

        <View style={styles.mapContainer}>
            <MapView style={styles.map} region={region} onRegionChangeComplete={(region) => {
              setLatitude(region.latitude);
              setLongitude(region.longitude);
            }}>
              <Marker coordinate={region} title="내 위치" />

              {restaurants.map((restaurant) => (
                <Marker
                  //key={restaurant.id} ❤️ id 값 넘겨받을 수 있을까요??
                  coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }} 
                  title={restaurant.name}
                />
              ))}

            </MapView>
        </View>

        <FlatList
          data={dummyRestaurants}
          renderItem={({ item }) => <RestaurantItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />

        <Button title="현재 위치 가져오기" onPress={geoLocation} />

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