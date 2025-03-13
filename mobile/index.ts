import { registerRootComponent } from 'expo';
import App from './App';
import React, { useState, useEffect, createContext } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView, View } from 'react-native';
import * as Font from 'expo-font';
import MainStcak from './Navigate';
import ListOfAbsences from './components/ListOfAbsences';
import Store from './store/store';

interface State {
    store: Store,
}

const store = new Store();
export const AppContext = createContext<State>({ 
    store, 
}); 

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
