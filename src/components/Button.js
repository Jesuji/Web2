import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const Button = ({ onPress, icon, text, style, textStyle, iconStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#DEBB8D',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Button;