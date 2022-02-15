import React from 'react';
import { FlatList } from 'react-native';

import { ItemSeparator } from '@src/components/ItemSeparator';
import { OrderCard } from '@src/components/OrderCard';

import { Container, Header, Title } from './styles';

export function Orders() {
  return (
    <Container>
      <Header>
        <Title>Pedidos Realizados</Title>
      </Header>

      <FlatList
        data={['1', '2', '3']}
        keyExtractor={item => item}
        renderItem={({ item, index }) => <OrderCard index={index} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </Container>
  );
}
