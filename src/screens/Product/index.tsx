import React, { useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import * as ImagePicker from 'expo-image-picker';

import Button from '@components/Button';
import { ButtonBack } from '@components/ButtonBack';
import Input from '@components/Input';
import { InputPrice } from '@components/InputPrice';
import { Photo } from '@components/Photo';

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters,
} from './styles';

export function Product() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleAdd() {
    if (!image) {
      Alert.alert('Cadastro', 'Selecione a imagem da pizza!');
    } else if (!name.trim()) {
      Alert.alert('Cadastro', 'Informe o nome da pizza!');
    } else if (!description.trim()) {
      Alert.alert('Cadastro', 'Informe a descrição da pizza!');
    } else if (!priceSizeP || !priceSizeM || !priceSizeG) {
      Alert.alert('Cadastro', 'Informe o preço de todos os tamanhos da pizza!');
    } else {
      setIsLoading(true);

      const fileName = new Date().getTime();
      const reference = storage().ref(`/pizzas/${fileName}.png`);

      await reference.putFile(image);
      const photo_url = await reference.getDownloadURL();

      firestore()
        .collection('pizzas')
        .add({
          name,
          name_insensitive: name.toLowerCase().trim(),
          description,
          prices_sizes: {
            p: priceSizeP,
            m: priceSizeM,
            g: priceSizeG,
          },
          photo_url,
          photo_path: reference.fullPath,
        })
        .then(() => Alert.alert('Cadastro', 'Pizza cadastrada com sucesso!'))
        .catch(() =>
          Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.'),
        );

      setIsLoading(false);
    }
  }

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <ButtonBack />
        <Title>Cadastrar</Title>

        <TouchableOpacity activeOpacity={0.7}>
          <DeleteLabel>Deletar</DeleteLabel>
        </TouchableOpacity>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Upload>
          <Photo uri={image} />

          <PickImageButton
            title="Carregar"
            type="secondary"
            onPress={handlePickerImage}
          />
        </Upload>

        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>
                {description.length} de 60 caracteres
              </MaxCharacters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e Preços</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />

            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />

            <InputPrice
              size="G"
              onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          <Button
            title="Cadastrar Pizza"
            style={{ marginBottom: 25 }}
            isLoading={isLoading}
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
