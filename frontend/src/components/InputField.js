// components/InputField.js
import React, { useState, forwardRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';

// forwardRef로 ref를 전달받아서 부모 컴포넌트에서 포커스를 설정할 수 있도록 함
const InputField = forwardRef(({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  placeholderTextColor = '#888',
  style,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <TextInput
      ref={ref}
      style={[styles.input, isFocused && styles.focusedInput, style]}
      placeholder={isFocused ? '' : placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  focusedInput: {
    fontWeight: 'bold',
    borderColor: '#d3a26e',  // 포커싱된 상태에서 테두리 색상
    borderWidth: 1,
  },
});

export default InputField;