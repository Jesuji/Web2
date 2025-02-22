import React, { useState } from 'react';
import { View, Text, Button, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import RestaurantItem from '../components/RestaurantItem';
import { useRestaurants } from '../hooks/useRestaurants';
import { useSearch } from '../hooks/useSearch';
import Geolocation from '@react-native-community/geolocation';

import Header from '../components/Header';

import { dummyRestaurants } from '../dummy';
import { dummySearchResults } from '../dummy';

const HomeScreen = () => {
  //const restaurants = useRestaurants();
  //const searchResults = useSearch(searchQuery, isSearchActive);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const geoLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;  // 숫자 그대로
        const lon = position.coords.longitude; // 숫자 그대로

        setLatitude(lat);  // setLatitude에 숫자 그대로 넘기기
        setLongitude(lon); // setLongitude에 숫자 그대로 넘기기
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };


  // 검색이 활성화되면 검색 결과, 아니면 전체 레스토랑 목록
  const dataToDisplay = isSearchActive ? dummySearchResults : dummyRestaurants;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container}>
        <Header/>
        <SearchBar
          placeholder="지금 먹고 싶은 고향 음식은?"
          value={searchQuery}
          onChange={setSearchQuery}
          onFocus={() => setIsSearchActive(true)}
        />

        <Text> ▼ 5km 이내</Text>
        

        <Text style={styles.locationText}>
          위도: {latitude}, 경도: {longitude}
        </Text>

        <FlatList
          data={dataToDisplay}  // 검색 결과 또는 전체 목록 표시
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
});

export default HomeScreen;