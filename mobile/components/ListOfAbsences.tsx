import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView, Modal, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AbsenceItem from './AbsenceItem';
import { Ionicons } from '@expo/vector-icons';
import FiltersBlock from './FiltersBlock';
import Menu from './Menu';
import AddAbsenceBlock from './AddAbsenceBlock';
import { AppContext } from '..';
import { observer } from 'mobx-react-lite';

type RootStackParamList = {
  Профиль: undefined;
  Пропуски: undefined;
  Вход: undefined;
};

type ListProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Пропуски'>;
};


const ListOfAbsences = observer(({ navigation }: ListProps) => {

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();
  const [fullName, setFullName] = useState<string|undefined>('');

  const { store } = useContext(AppContext);

  const handleApplyFilters = (sortOrder: 'asc' | 'desc', selectedStatus: string | undefined, selectedType: string | undefined, fullName: string | undefined) => {
    setSortOrder(sortOrder);
    setSelectedStatus(selectedStatus);
    setSelectedType(selectedType);
    setFullName(fullName);
  };


  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = store.userPermissions.canCheck? undefined : store.user.id;
        await store.getAbsences(userId, undefined, fullName, selectedStatus, selectedType, sortOrder === "asc" ? "TimeCreatedAsc" : "TimeCreatedDesc");
      }
      catch (error: any) {
        const errorMessage = error?.status ? `Ошибка ${error.status}` : "Произошла непредвиденная ошибка";
        console.log(errorMessage);
      }
    };

    loadData();
  }, [sortOrder, selectedStatus, selectedType, fullName, store.newAbsence]);


  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [isAddAbsenceVisible, setIsAddAbsenceBlockVisible] = useState(false);


  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Список пропусков</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ top: '5%', backgroundColor: 'white' }}
        data={store.absences}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View>
            {store.userPermissions.canCreate &&
            <TouchableOpacity style={styles.button} onPress={() => setIsAddAbsenceBlockVisible(true)}>
              <Text style={[styles.headerTitle, { color: 'white' }]}>Добавить пропуск</Text>
            </TouchableOpacity>
            }
            <Text style={styles.emptyText}>Пропуски отсутствуют</Text>
          </View>
        }
          renderItem={({ item, index }) => (
            <View style={index === store.absences.length - 1 ? styles.lastItem : null}>
              {(index === 0 && store.userPermissions.canCreate) && (
                <TouchableOpacity style={styles.button} onPress={() => setIsAddAbsenceBlockVisible(true)}>
                  <Text style={[styles.headerTitle, {color: 'white'}]}>Добавить пропуск</Text>
                </TouchableOpacity>
              )}
              <AbsenceItem item={item}/>
            </View>
          )}
      />

      <FiltersBlock
        isVisible={isFilterModalVisible}
        closeModal={() => setIsFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />

      <AddAbsenceBlock 
        isVisible={isAddAbsenceVisible}
        closeModal={() => setIsAddAbsenceBlockVisible(false)}
      />

      <Menu navigation={navigation} />

    </View>

  );
})

export default ListOfAbsences;

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
    marginBottom: 130
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