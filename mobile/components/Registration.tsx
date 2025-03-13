import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppContext } from '..';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => emailRegex.test(email);
const isValidPassword = (password: string) => password.length >= 6;

type RootStackParamList = {
  Вход: undefined;
  Регистрация: undefined;
};

type RegProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Регистрация'>;
};

export default function Registration({ navigation }: RegProps) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
const [passwordError, setPasswordError] = useState('');

  const { store } = useContext(AppContext);

  const isFormValid = name && surname && email && password && isValidEmail(email) && isValidPassword(password);

  const loadAuthForm = () => {
    navigation.navigate('Вход');
  };

  const register = async () => {
    try {
      await store.register(email, password, name, surname);
    } catch (error: any) {
      const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
      Alert.alert(errorMessage);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>

        <Text style={{ alignSelf: 'center', marginBottom: 15, fontSize: 25, fontFamily: 'inter-semi-bold' }}>Регистрация</Text>

        <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Имя</Text>
        <TextInput
          style={styles.input}
          placeholder="Иван"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#a8a8a8"
        />

        <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Фамилия</Text>
        <TextInput
          style={styles.input}
          placeholder="Иванов"
          value={surname}
          onChangeText={setSurname}
          placeholderTextColor="#a8a8a8"
        />

        <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>E-mail</Text>
        <TextInput style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="example@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (text !== "" && !isValidEmail(text)) {
              setEmailError('Введите корректный email');
            } else {
              setEmailError('');
            }
          }}
          keyboardType="email-address"
          placeholderTextColor="#a8a8a8"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Text style={{ marginLeft: 5, fontFamily: 'inter-md' }}>Пароль</Text>
        <TextInput style={[styles.input, passwordError ? styles.errorInput : null]}
          placeholder="Введите пароль..."
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (text !== "" && !isValidPassword(text)) {
              setPasswordError('Минимальная длина пароля 6 символов');
            } else {
              setPasswordError('');
            }
          }}
          placeholderTextColor="#a8a8a8"
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      </View>

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        disabled={!isFormValid}
        onPress={register}
      >
        <Text style={{ color: 'white', fontFamily: 'inter-md' }}>Зарегистрироваться</Text>
      </TouchableOpacity>

      <Text style={{ fontFamily: 'inter-md' }}>Уже есть аккаунт?</Text>
      <TouchableOpacity onPress={loadAuthForm}>
        <Text style={{ color: '#3478F6', fontFamily: 'inter-md' }}>Войдите</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    margin: 'auto',
    marginTop: '40%',
    marginBottom: 50
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 5
  },
  errorInput: {
    borderColor: 'red',
    marginBottom: 0,
  },
});