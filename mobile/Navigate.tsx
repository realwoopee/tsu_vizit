import React from 'react';
import Header from './components/Header';
import AuthorizationForm from './components/AuthorizationForm';
import Registration from './components/Registration';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Navigate() {
    return <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                header: () => <Header />,
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
        </Stack.Navigator>
    </NavigationContainer>
}