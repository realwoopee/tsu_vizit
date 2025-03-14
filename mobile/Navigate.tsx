import React, { useState,  useEffect, useContext } from 'react';
import AuthorizationForm from './components/AuthorizationForm';
import Registration from './components/Registration';
import Profile from './components/Profile';
import ListOfAbsences from './components/ListOfAbsences';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Header from './components/Header';
import { AppContext } from '.';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function Navigate() {

    const [initialRoute, setInitialRoute] = useState<string | null>(null);
    const {store} = useContext (AppContext);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const refreshToken = await AsyncStorage.getItem('refreshToken');

                if (token && refreshToken) {
                    await store.checkAuth(); 
                    setInitialRoute(store.isAuth ? 'Профиль' : 'Вход');
                } else {
                    setInitialRoute('Вход');
                }
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                setInitialRoute('Вход');
            }
        };

        checkAuth();
    }, [store]);

    if (initialRoute === null) {
        return null;
    }

    return <NavigationContainer>
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                header: () => <Header />,
                gestureEnabled: false
            }}
        >
            <Stack.Screen
                name="Вход"
                component={AuthorizationForm}
            />
            <Stack.Screen
                name="Регистрация"
                component={Registration}
            />
            <Stack.Screen
                name="Профиль"
                component={Profile}
            />
            <Stack.Screen
                name="Пропуски"
                component={ListOfAbsences}
            />
        </Stack.Navigator>
    </NavigationContainer>
}