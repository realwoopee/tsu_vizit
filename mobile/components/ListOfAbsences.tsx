import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AbsenceItem from './AbsenceItem';
import { Ionicons } from '@expo/vector-icons';
import FiltersBlock from './FiltersBlock';

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
    { id: "1", status: "check", name: "Ivanov Ivan Ivanovich", type: "study", beg: "2025-02-03", end: "2025-04-04", docs: [] },
    { id: "2", status: "accept", name: "Ivanov Ivan Ivanovich", type: "family", beg: "2025-02-03", end: "2025-04-04", docs: [] },
    { id: "3", status: "check", name: "Ivanov Ivan Ivanovich", type: "study", beg: "2025-02-03", end: "2025-04-04", docs: [] },
    { id: "4", status: "accept", name: "Ivanov Ivan Ivanovich", type: "family", beg: "2025-02-03", end: "2025-04-04", docs: [] },
    { id: "5", status: "reject", name: "Ivanov Ivan Ivanovich", type: "illness", beg: "2025-02-03", end: "2025-04-04", docs: [] }
  ]);


  const onAddDocument = (id: string, newDocs: Doc[]) => {
    setListOfItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, docs: [ ...newDocs] } : item
      )
    );
  };

  const onRemoveDocument = (id: string, delDoc: string) => {
    setListOfItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, docs: item.docs.filter(doc => doc.uri !== delDoc) }
          : item
      )
    );
  };

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

 
  return (
    <View >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Список пропусков</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        // style={{flex: 1}}
        style={{marginBottom: 120, top: '5%'}}
        data={listOfItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Пропуски отсутствуют</Text>
        }
        renderItem={({ item }) => (
          <AbsenceItem item={item} onAddDocument={onAddDocument} onRemoveDocument={onRemoveDocument} />
        )}
      />

    <FiltersBlock
        isVisible={isFilterModalVisible}
        closeModal={() => setIsFilterModalVisible(false)}
      />

    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'none',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    top: '5%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'inter-semi-bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
    fontFamily: 'inter-md'
  },
})