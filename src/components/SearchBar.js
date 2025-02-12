import React from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';

const SearchBar = ({ placeholder, value, onChange, onFocus }) => (
  <TouchableOpacity style={styles.container} onPress={onFocus}>
    <Image source={require('../../assets/images/search.png')} style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onFocus={onFocus}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 17,
  },
});

export default SearchBar;