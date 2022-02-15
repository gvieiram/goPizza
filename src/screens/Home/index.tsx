/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';

import happyEmoji from '@assets/happy.png';
import { ProductCard, ProductProps } from '@components/ProductCard';
import { Search } from '@components/Search';
import { useAuth } from '@src/hooks/auth';

import {
  Container,
  Header,
  Title,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemsNumber,
  NewProductButton,
} from './styles';

export function Home() {
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState('');

  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const { signOut } = useAuth();

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection('pizzas')
      .orderBy('name_insensitive')
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then(response => {
        const data = response.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductProps[];
        setPizzas(data);
      })
      .catch(err => {
        Alert.alert('Consulta', 'Não foi possível realizar a consulta ');
        console.log(err);
      });
  }

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch('');
    fetchPizzas('');
  }

  function handleOpen(id: string) {
    navigation.navigate('product', { id });
  }

  function handleAdd() {
    navigation.navigate('product', {});
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas('');
    }, []),
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>

        <TouchableOpacity activeOpacity={0.4} onPress={() => signOut()}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>
          {pizzas.length} {pizzas.length === 1 ? 'pizza' : 'pizzas'}
        </MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />

      <NewProductButton
        title="Cadastrar Pizza"
        type="secondary"
        onPress={handleAdd}
      />
    </Container>
  );
}
