import React, { useState, useEffect, createContext } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View } from 'react-native';
import * as Font from 'expo-font';
import MainStcak from './Navigate';
import Store from './store/store';
import { SafeAreaView } from 'react-native-safe-area-context';

const fonts = () => Font.loadAsync({
  'inter-semi-bold': require('./assets/fonts/Inter_18pt-SemiBold.ttf'),
  'inter-md': require('./assets/fonts/Inter_18pt-Medium.ttf')
});

interface State {
  store: Store,
}

const store = new Store();
export const AppContext = createContext<State>({
  store,
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (

    <AppContext.Provider value={{ store }}>
      <View style={styles.container}>
        <MainStcak />
      </View>
    </AppContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});