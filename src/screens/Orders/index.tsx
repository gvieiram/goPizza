import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';

import firestore from '@react-native-firebase/firestore';

import { ItemSeparator } from '@src/components/ItemSeparator';
import { OrderCard, OrderProps } from '@src/components/OrderCard';
import { useAuth } from '@src/hooks/auth';

import { Container, Header, Title } from './styles';

export function Orders() {
  const [orders, setOrders] = useState<OrderProps[]>([]);
  const { user } = useAuth();

  function handlePizzaDelivered(id: string | undefined) {
    Alert.alert('Pedido', 'Confirmar que o pedido foi entregue?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => {
          firestore()
            .collection('orders')
            .doc(id)
            .update({ status: 'Entregue' });
        },
      },
    ]);
  }

  useEffect(() => {
    const subscribe = firestore()
      .collection('orders')
      .where('waiter_id', '==', user?.id)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as OrderProps[];
        setOrders(data);
      });

    return () => subscribe();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Pedidos Realizados</Title>
      </Header>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status === 'Entregue'}
            onPress={() => handlePizzaDelivered(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={ItemSeparator}
      />
    </Container>
  );
}
