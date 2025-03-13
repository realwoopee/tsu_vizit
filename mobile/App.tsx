import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import MainStcak from './Navigate';
import Profile from './components/Profile';
import { SafeAreaView } from 'react-native-safe-area-context';

const fonts = () => Font.loadAsync({
  'inter-semi-bold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
  'inter-md': require('./assets/fonts/Inter_18pt-Medium.ttf')
});

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await fonts();
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MainStcak />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});