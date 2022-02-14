import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation, useRoute } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import Button from '@components/Button';
import { ButtonBack } from '@components/ButtonBack';
import Input from '@components/Input';
import { InputPrice } from '@components/InputPrice';
import { Photo } from '@components/Photo';
import { ProductNavigationProps } from '@src/@types/navigation';
import { ProductProps } from '@src/components/ProductCard';

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

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoPath, setPhotoPath] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

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

  function validatePizza() {
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
    }
  }

  async function handleAdd() {
    validatePizza();

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
      .then(() => navigation.navigate('home'))
      .catch(() => {
        setIsLoading(false);
        Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza.');
      });
  }

  async function handleUpdate() {
    validatePizza();

    // const fileName = new Date().getTime();
    // const reference = storage().ref(`/pizzas/${fileName}.png`);

    // await reference.putFile(image);
    // const photo_url = await reference.getDownloadURL();

    // if (image !== image) {
    //   console.log('teste');
    // }

    firestore()
      .collection('pizzas')
      .doc(id)
      .update({
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        // photo_url,
        // photo_path: reference.fullPath,
      })
      .then(() => navigation.navigate('home'))
      .catch(() => {
        setIsLoading(false);
        Alert.alert('Atualização', 'Não foi possível atualizar a pizza.');
      });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleDelete() {
    firestore()
      .collection('pizzas')
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => navigation.navigate('home'));
      });
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then(response => {
          const product = response.data() as PizzaResponse;

          setName(product.name);
          setImage(product.photo_url);
          setDescription(product.description);
          setPriceSizeP(product.prices_sizes.p);
          setPriceSizeM(product.prices_sizes.m);
          setPriceSizeG(product.prices_sizes.g);
          setPhotoPath(product.photo_path);
        });
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header>
        <ButtonBack onPress={handleBack} />
        <Title>Cadastrar</Title>

        {id ? (
          <TouchableOpacity activeOpacity={0.7} onPress={handleDelete}>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 20 }} />
        )}
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Upload>
          <Photo uri={image} />

          {/* {id && (              Esconder somente para nao admin */}
          <PickImageButton
            title="Carregar"
            type="secondary"
            onPress={handlePickerImage}
          />
          {/* )} */}
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
            title={id ? 'Atualizar Pizza' : 'Cadastrar Pizza'}
            style={{ marginBottom: 25 }}
            isLoading={isLoading}
            onPress={id ? handleUpdate : handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
