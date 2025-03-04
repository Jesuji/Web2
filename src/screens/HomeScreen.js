import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import RestaurantItem from '../components/RestaurantItem';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { postMyLocation, searchRestaurants } from '../services/api';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';

//import { dummyRestaurants} from '../dummy';


const HomeScreen = () => {
  const nav = useNavigation();

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  // const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedRestaurants, setSearchedRestaurants] = useState([]);


  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = 35.479378341721;
        const lon = 128.75233566843;

        setLatitude(lat);
        setLongitude(lon);
        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        });
        getRestaurants(lat, lon);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    geoLocation(); // 처음 로딩 시 내 위치를 가져오기
  }, []);

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
    postMyLocation(lat, lon, 5)
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  // 검색 함수
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      searchRestaurants(query)
        .then((response) => {
          setSearchedRestaurants(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setIsSearching(false);
      setSearchedRestaurants([]);
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

        {searchedRestaurants.length === 0 ? (
          <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
        ) : (
          //검색된 데이터
          <FlatList
            data={searchedRestaurants}
            renderItem={({ item }) => <RestaurantItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </>
        ) : (
          <>
            <View style={styles.mapContainer}>
              <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={(newRegion) => {
                setRegion(newRegion);
              }}
              // onPress={(e) => {
              //   const { latitude, longitude } = e.nativeEvent.coordinate; // 클릭한 위치 받아오기
              //   setLocation({ latitude, longitude }); // 클릭한 위치로 마커 이동
              // }}
              >
                {latitude && longitude && (
                  <Marker
                    coordinate={{ latitude, longitude }}
                    title="내위치"
                    pinColor="red"
                  />
                )}

                {/* {location && (
                  <Marker
                    coordinate={location}
                    title="위치" // 마커 이름을 "위치"로 설정
                    pinColor="blue"
                  />
                )} */}

                {restaurants.map((restaurant) => (
                  <Marker
                    key={restaurant.id}
                    coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
                    title={restaurant.name}
                    onPress={() => nav.navigate('RestaurantDetail', { restaurant })}
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