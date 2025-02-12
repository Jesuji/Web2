import React, { useState } from 'react';
import { View, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import RestaurantItem from '../components/RestaurantItem';
import { useRestaurants } from '../hooks/useRestaurants';
import { useSearch } from '../hooks/useSearch';
//import styles from '../styles/MainScreenStyles';

import Header from '../components/Header';

import { dummyRestaurants } from '../dummy';
import { dummySearchResults } from '../dummy';

const MainScreen = () => {
  //const restaurants = useRestaurants();
  //const searchResults = useSearch(searchQuery, isSearchActive);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


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

        <FlatList
          data={dataToDisplay}  // 검색 결과 또는 전체 목록 표시
          renderItem={({ item }) => <RestaurantItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />

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

export default MainScreen;