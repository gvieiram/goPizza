/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useState } from 'react';
import { Platform, ScrollView } from 'react-native';

import Button from '@src/components/Button';
import { ButtonBack } from '@src/components/ButtonBack';
import Input from '@src/components/Input';
import { RadioButton } from '@src/components/RadioButton';
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

export function Order() {
  const [size, setSize] = useState('');

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack
            // onPress={() => {}}
            style={{ marginBottom: 108 }}
          />
        </Header>
        <Photo
          source={{ uri: 'https://github.com/gvieiram.png' }}
          style={{ backgroundColor: 'gray' }}
        />
        <Form>
          <Title>Pizza</Title>
          <Label>Selecione um tamanho:</Label>

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
              <Input keyboardType="numeric" />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input keyboardType="numeric" />
            </InputGroup>
          </FormRow>

          {size !== '' ? (
            PIZZA_TYPES.map(item => {
              if (size === item.id) {
                return (
                  <Price key={item.id}>{`Valor de R$${item.price}`}</Price>
                );
              }
            })
          ) : (
            <Price>Valor de R$ 00,00</Price>
          )}

          <Button
            title="Confirmar Pedido"
            // onPress={() => console.log(size)}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
