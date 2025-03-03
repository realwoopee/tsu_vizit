import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AbsenceItem from './AbsenceItem';
import Header from './Header';

// type RootStackParamList = {
//   Вход: undefined;
//   Регистрация: undefined;
//   Пропуски: undefined;
// };

// type AbsenceListProps = {
//   navigation: StackNavigationProp<RootStackParamList, 'Пропуски'>;
// };

type Doc = {
    name: string;
    type: string;
    uri: string;
  };
  
  type Item = {
    id: string;
    status: string;
    name: string;
    type: string;
    beg: string;
    end: string;
    docs: Doc[];
  };

export default function ListOfAbsences() { //{ navigation }: AbsenceListProps
  /*const loadScene = () => {
    navigation.navigate('Пропуски');
  }*/

  const [listOfItems, setListOfItems] = useState<Item[]>([
    {id:"1", status:"check", name:"Ivanov Ivan Ivanovich", type:"study", beg:"02.03.2025", end:"03.03.2025", docs:[]},
    {id:"2", status:"accept", name:"Ivanov Ivan Ivanovich", type:"family", beg:"02.03.2025", end:"03.03.2025", docs:[]},
    {id:"3", status:"check", name:"Ivanov Ivan Ivanovich", type:"study", beg:"02.03.2025", end:"03.03.2025", docs:[]},
    {id:"4", status:"accept", name:"Ivanov Ivan Ivanovich", type:"family", beg:"02.03.2025", end:"03.03.2025", docs:[]},
    {id:"5", status:"reject", name:"Ivanov Ivan Ivanovich", type:"illness", beg:"02.03.2025", end:"03.03.2025", docs:[]}
  ]);

  return (
    <View >
        <Header/>
        <FlatList 
        style={{flex: 1}}
        data = {listOfItems} 
        keyExtractor={item => item.id.toString()} 
        ListEmptyComponent={
            <Text style={styles.emptyText}>Пропуски отсутствуют</Text>
        }
        renderItem={({item}) => (
            <AbsenceItem item={item}/>
        )}
        />
      
    </View>
  );
}
const styles = StyleSheet.create({
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        padding: 16,
      }
    })