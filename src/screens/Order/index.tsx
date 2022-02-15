/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

import { OrderNavigationProps } from '@src/@types/navigation';
import Button from '@src/components/Button';
import { ButtonBack } from '@src/components/ButtonBack';
import Input from '@src/components/Input';
import { ProductProps } from '@src/components/ProductCard';
import { RadioButton } from '@src/components/RadioButton';
import { useAuth } from '@src/hooks/auth';
import { PIZZA_TYPES } from '@src/Utils/pizzaTypes';

import {
  Container,
  Form,
  FormRow,
  Header,
  InputGroup,
  Label,
  Photo,
  Price,
  Sizes,
  Title,
} from './styles';

type PizzaResponse = ProductProps & {
  prices_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const [size, setSize] = useState('');
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);

  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;

  const amount = size ? pizza.prices_sizes[size] * quantity : '0,00';

  function handleBack() {
    navigation.goBack();
  }

  function handleOrder() {
    if (!size) {
      return Alert.alert('Pedido', 'Selecione o tamanho da pizza!');
    }
    if (!tableNumber) {
      return Alert.alert('Pedido', 'Informe o número da mesa!');
    }
    if (!quantity) {
      return Alert.alert('Pedido', 'Informe a quantidade');
    }

    setSendingOrder(true);

    firestore()
      .collection('orders')
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        status: 'Preparando',
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() => navigation.navigate('home'))
      .catch(() => {
        Alert.alert('Pedido', 'Não foi possível realizar o pedido');
        setSendingOrder(false);
      });
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(res => setPizza(res.data() as PizzaResponse))
        .catch(() =>
          Alert.alert('Pedido', 'Não foi possível carregar o produto'),
        );
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleBack} style={{ marginBottom: 108 }} />
        </Header>
        <Photo source={{ uri: pizza.photo_url }} resizeMode="stretch" />
        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>

          <Sizes>
            {PIZZA_TYPES.map(item => (
              <RadioButton
                key={item.id}
                title={item.name}
                onPress={() => setSize(item.id)}
                selected={size === item.id}
              />
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={value => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ {amount}</Price>

          <Button
            title="Confirmar Pedido"
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
