import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Вход: undefined;
  Профиль: undefined;
};

type RegProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function Registration({ navigation }: RegProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = name && surname && email && password;

  const loadAuthForm = () => {
    navigation.navigate('Вход');
  };
  const loadProfile = () => {
    navigation.navigate('Профиль');
  };

  return (
    <View style={{backgroundColor: "#fff", height: "100%"}}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={{ alignSelf: 'center', marginBottom: 15, fontSize: 25, fontFamily: 'inter-semi-bold' }}>Регистрация</Text>
          
          <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Имя</Text>
          <TextInput
            style={styles.input}
            placeholder="Иван"
            value={name}
            onChangeText={setName}
          />
          
          <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Фамилия</Text>
          <TextInput
            style={styles.input}
            placeholder="Иванов"
            value={surname}
            onChangeText={setSurname}
          />
          
          <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Пароль</Text>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль..."
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
        >
          <Text style={{ color: 'white', fontFamily: 'inter-md' }} onPress={loadProfile}>Зарегистрироваться</Text>
        </TouchableOpacity>

        <Text style={{ fontFamily: 'inter-md' }}>Уже есть аккаунт?</Text>
        <TouchableOpacity onPress={loadAuthForm}>
          <Text style={{ color: '#3478F6', fontFamily: 'inter-md' }}>Войдите</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 'auto'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#a8a8a8',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  form: {
    width: '100%'
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3478F6',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 12,
    height: 40
  },
  buttonDisabled: {
    backgroundColor: '#a8a8a8'
  }
});