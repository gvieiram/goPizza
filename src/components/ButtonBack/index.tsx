import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';

import { Container } from './styles';

export function ButtonBack({ ...rest }: RectButtonProps) {
  const { COLORS } = useTheme();
  return (
    <Container {...rest}>
      <MaterialIcons name="chevron-left" size={18} color={COLORS.TITLE} />
    </Container>
  );
}
