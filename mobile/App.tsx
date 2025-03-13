import React, { useState, useEffect, createContext } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View } from 'react-native';
import * as Font from 'expo-font';
import MainStcak from './Navigate';
import ListOfAbsences from './components/ListOfAbsences';
import Store from './store/store';


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
      <ScrollView contentContainerStyle={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ScrollView>
    );
  }

  return (
    <AppContext.Provider value={{ store }}>
      <ScrollView contentContainerStyle={styles.container}>
        <MainStcak />
        {/* <ListOfAbsences/> */}
      </ScrollView>
    </AppContext.Provider>
    // <View style={styles.container}>
    //    <ListOfAbsences/>
    // </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});