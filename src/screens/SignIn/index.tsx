import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import brandImg from '@assets/brand.png';
import Button from '@components/Button';
import Input from '@components/Input';

import {
  Container,
  Content,
  Title,
  Brand,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from './styles';

export default function SignIn() {
  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content>
          <Brand source={brandImg} />

          <Title>Login</Title>

          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
          />

          <Input placeholder="Senha" type="secondary" secureTextEntry />

          <ForgotPasswordButton activeOpacity={0.7}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button title="Entrar" type="secondary" />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
