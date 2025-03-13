import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Регистрация: undefined;
  Профиль: undefined;
};

type AuthFormProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function AuthorizationForm({ navigation }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email && password;

  const loadReg = () => {
    navigation.navigate('Регистрация');
  };
  const loadProfile = () => {
    navigation.navigate('Профиль');
  };

  return (
    <View style={{backgroundColor: "#fff", height: "100%"}}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={{alignSelf: 'center', marginBottom: 15, fontSize: 25, fontFamily: 'inter-semi-bold'}}>Вход</Text>
          <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>E-mail</Text>
          <TextInput style={styles.input}
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          <Text style={{marginLeft: 5, fontFamily: 'inter-md'}}>Пароль</Text>
            <TextInput style={styles.input}
              placeholder="Введите пароль..."
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
        </View>
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid} onPress={loadProfile}
        >
            <Text style={{color: 'white', fontFamily: 'inter-md'}}>Войти</Text>
        </TouchableOpacity>

        <Text style={{fontFamily: 'inter-md'}}>Еще нет аккаунта?</Text>
        <TouchableOpacity onPress={loadReg}>
          <Text style={{color: '#3478F6', fontFamily: 'inter-md'}}>Зарегистрируйтесь</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    margin: 'auto'
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