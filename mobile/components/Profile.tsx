import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Menu from './Menu';

type RootStackParamList = {
  Профиль: undefined;
  Пропуски: undefined;
};

type ProfileProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Профиль'>;
};

const getProfileData = async () => {
  return new Promise<{ fullName: string; email: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        fullName: 'Фамилия Имя',
        email: 'example@email.com',
      });
    }, 0);
  });
};

export default function Profile({navigation} : ProfileProps) {

  const [initialFullName, setInitialFullName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await getProfileData();
      setInitialFullName(data.fullName);
      setInitialEmail(data.email);
      setFullName(data.fullName);
      setEmail(data.email);
    };

    loadData();
  }, []);

  const isFormChanged = fullName !== initialFullName || email !== initialEmail;

  const updButtonStyle = isFormChanged ? styles.updButton : [styles.updButton, styles.disabledButton];

  return (
    <View style={{ backgroundColor: "#fff", height: "100%", padding: '10%' }}>
      <Text style={styles.role}>Роль</Text>
      <Text style={{ fontFamily: 'inter-md', color: '#a8a8a8' }}>ФИО</Text>
      <TextInput
        style={styles.fullName}
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={{ fontFamily: 'inter-md', marginTop: 10, color: '#a8a8a8' }}>Email</Text>
      <TextInput
        style={styles.email}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={updButtonStyle}
        disabled={!isFormChanged}
      >
        <Text style={{ color: 'white', fontFamily: 'inter-md' }}>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton}>
        <Text style={{ color: 'white', fontFamily: 'inter-md' }}>Выйти</Text>
      </TouchableOpacity>

      <Menu navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  role: {
    color: '#3478F6',
    padding: 10,
    fontSize: 27,
    fontFamily: 'inter-semi-bold',
    marginTop: '30%',
    alignSelf: 'center',
  },
  email: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#a8a8a8',
  },
  fullName: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#a8a8a8',
    padding: 10,
    fontSize: 25,
    fontFamily: 'inter-semi-bold',
  },
  exitButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eb4e3d',
    borderRadius: 10,
    marginBottom: 12,
    height: 40,
  },
  updButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3478F6',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 7,
    height: 40,
  },
  disabledButton: {
    backgroundColor: '#a8a8a8'
  },
});