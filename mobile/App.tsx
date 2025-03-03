import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as Font from 'expo-font';
import MainStcak from './Navigate';
import ListOfAbsences from './components/ListOfAbsences';

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
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MainStcak />
      {/* <ListOfAbsences/> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});