import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AbsenceItem from './AbsenceItem';
import { Ionicons } from '@expo/vector-icons';
import FiltersBlock from './FiltersBlock';
import Menu from './Menu';

type RootStackParamList = {
  Профиль: undefined;
  Пропуски: undefined;
  Вход: undefined;
};

type ListProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Пропуски'>;
};

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

export default function ListOfAbsences({ navigation }: ListProps) {

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
        item.id === id ? { ...item, docs: [...newDocs] } : item
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
    <View style={{backgroundColor: 'white'}}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Список пропусков</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ top: '5%', backgroundColor: 'white' }}
        data={listOfItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View>
            <TouchableOpacity style={styles.button}>
              <Text style={[styles.headerTitle, {color: 'white'}]}>Добавить пропуск</Text>
            </TouchableOpacity>

            <Text style={styles.emptyText}>Пропуски отсутствуют</Text>
          </View>
        }
          renderItem={({ item, index }) => (
            <View style={index === listOfItems.length - 1 ? styles.lastItem : null}>
              {index === 0 && (
                <TouchableOpacity style={styles.button}>
                  <Text style={[styles.headerTitle, {color: 'white'}]}>Добавить пропуск</Text>
                </TouchableOpacity>
              )}
              <AbsenceItem item={item} onAddDocument={onAddDocument} onRemoveDocument={onRemoveDocument} />
            </View>
          )}
      />

      <FiltersBlock
        isVisible={isFilterModalVisible}
        closeModal={() => setIsFilterModalVisible(false)}
      />

      <Menu navigation={navigation} />

    </View>

  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
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
  lastItem: {
    marginBottom: 200
  },
  button: {
    backgroundColor: '#3478F6',
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '92%',
    marginTop: 10
  }
})