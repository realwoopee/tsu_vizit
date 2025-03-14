import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Профиль: undefined;
    Пропуски: undefined;
    Вход: undefined;
};
  
type MenuProps = {
    navigation: StackNavigationProp<RootStackParamList>;
};

export default function Menu({navigation} : MenuProps) {
    let current: string;
    const loadProfile = () => {
        if(current != 'Профиль') { navigation.navigate('Профиль'); current = 'Профиль';}
    };
    
    const loadAbsences = () => {
        if(current !== 'Пропуски'){ navigation.navigate('Пропуски'); current = 'Пропуски'; }
    };
    
    return (
    <View style={styles.container}>

        <TouchableOpacity onPress={loadProfile}>
            <Feather name="user" size={40} color="#3478F6" />
        </TouchableOpacity>

        <TouchableOpacity onPress={loadAbsences}>
            <FontAwesome6 name="id-card" size={40} color="#3478F6" />
        </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '70%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 160,
        padding: 10,
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'white',
        shadowColor: '#3478F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4
    }
});