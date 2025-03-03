import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Вход: undefined;
  Регистрация: undefined;
};

type RegProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Регистрация'>;
};

export default function Registration({ navigation }: RegProps) {
  const loadScene = () => {
    navigation.navigate('Вход');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={{alignSelf: 'center', marginBottom: 15, fontSize: 25, fontFamily: 'inter-semi-bold'}}>Регистрация</Text>
        <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>Имя</Text>
        <TextInput style={styles.input}
            placeholder="Иван"
          />
        <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>Фамилия</Text>
          <TextInput style={styles.input}
            placeholder="Иванов"
          />
        <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>E-mail</Text>
          <TextInput style={styles.input}
            placeholder="exapmle@email.com"
          />
        <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>Пароль</Text>
          <TextInput style={styles.input}
            placeholder="Введите пароль..."
            secureTextEntry={true}
          />
      </View>
      <TouchableOpacity style={styles.button}>
          <Text style={{color: 'white', fontFamily: 'inter-md'}}>Зарегистрироваться</Text>
        </TouchableOpacity>
      <Text style={{fontFamily: 'inter-md'}}>Уже есть аккаунт?</Text>
      <TouchableOpacity onPress={loadScene}>
        <Text style={{color: '#366899', fontFamily: 'inter-md'}}>Войдите</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      width: '80%',
      alignItems: 'center',
      flexDirection: 'column',
      margin: 'auto',
      marginTop: 50,
      marginBottom: 50
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: '#a8a8a8',
      padding: 10,
      marginTop: 5,
      marginBottom: 15
    },
    form: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      shadowColor: "#898989",
      shadowOpacity: 0.8,
      shadowRadius: 7,
      shadowOffset: {
        height: 1,
        width: 1
      }
    },
    button: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#245FA1',
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 12,
      height: 40
    }
});