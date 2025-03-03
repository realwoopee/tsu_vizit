import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../assets/headerLogo';

export default function Header() {
  return (
    <View style={styles.container}>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#245FA1',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    height: 70,
    width: '100%',
    paddingLeft: 10
  }
});