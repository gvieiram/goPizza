/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';

import happyEmoji from '@assets/happy.png';
import { ProductCard } from '@components/ProductCard';
import { Search } from '@components/Search';

import {
  Container,
  Header,
  Title,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemsNumber,
} from './styles';

export function Home() {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>

        <TouchableOpacity activeOpacity={0.4}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>

      <Search onSearch={() => {}} onClear={() => {}} />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>10 pizzas</MenuItemsNumber>
      </MenuHeader>

      <ProductCard
        data={{
          id: '1',
          name: 'Adicionando UI',
          description: 'Teste UI',
          photo_url: 'https://github.com/gvieiram.png',
        }}
      />
    </Container>
  );
}
