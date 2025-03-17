import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Menu from './Menu';
import { AppContext } from '..';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: string) => emailRegex.test(email);

type RootStackParamList = {
  Профиль: undefined;
  Пропуски: undefined;
  Вход: undefined;
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



export default function Profile({ navigation }: ProfileProps) {

  const [initialFullName, setInitialFullName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const [emailError, setEmailError] = useState('');

  const { store } = useContext(AppContext);

  const logout = async () => {
    try {
      await store.logout();
      navigation.navigate('Вход');
    } catch (error: any) {
      const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
      Alert.alert(errorMessage);
    }
  }

  const editProfile = async () => {
    try {
      await store.editProfile(fullName, email);
      const data = store.user;
      setInitialFullName(data.fullName);
      setInitialEmail(data.email);
    } catch (error: any) {
      const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
      Alert.alert(errorMessage);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        await store.getProfile();
        const data = store.user;
        setInitialFullName(data.fullName);
        setInitialEmail(data.email);
        setFullName(data.fullName);
        setEmail(data.email);

        data.role == 'Student' ? setRole('Студент') : data.role == 'Teacher' ? setRole('Преподаватель') : data.role == 'DeansEmployee' ? setRole('Деканат') : setRole('Администратор');
      }
      catch (error: any) {
        const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
        Alert.alert(errorMessage);
      }
    };

    loadData();
  }, []);

  const isFormChanged = (fullName !== initialFullName || email !== initialEmail) && isValidEmail(email) && fullName;

  const updButtonStyle = isFormChanged ? styles.updButton : [styles.updButton, styles.disabledButton];

  return (
    <View style={{ backgroundColor: "#fff", height: "100%", padding: '10%'}}>
      <Text style={styles.role}>{role}</Text>
      <Text style={{ fontFamily: 'inter-md', color: '#a8a8a8' }}>ФИ</Text>
      <TextInput
        style={styles.fullName}
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={{ fontFamily: 'inter-md', marginTop: 10, color: '#a8a8a8' }}>Email</Text>
      <TextInput
        style={[styles.email, emailError ? styles.errorInput : null]}
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
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity
        style={updButtonStyle}
        disabled={!isFormChanged}
        onPress={editProfile}
      >
        <Text style={{ color: 'white', fontFamily: 'inter-md' }}>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={logout}>
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
    fontSize: 30,
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