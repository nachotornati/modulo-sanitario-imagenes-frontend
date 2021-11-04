import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, StatusBar, Text, FlatList, TouchableHighlight, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FamilyInfoCard } from './Components/FamilyInfoCard';
import { GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';

/* https://reactnavigation.org/docs/native-stack-navigator/ */

function GoogleLogIn ({navigation}){

  function config(){
    GoogleSignin.configure({
      webClientId: '',
      androidClientId: ''
    });
  }

  /*
    El backend principal
    mira el token que le mandamos
    y verifica si puede entrar a la path
    En AsyncStorage guardamos el token jwt
  */

  var signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      /*this.setState({ userInfo });*/
      console.log(userInfo.idToken) /* Este es el JWT */
      navigation.navigate('Families')
    }
    catch (error) {
      console.log(error)
    }
  };

  config()
  return(
    <View>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        /*disabled={isSigninInProgress}*/
      />
    </View>
  )

};

function FamilyScreen({ navigation, route }) {
  const [ information, setInformation ] = useState();
  const { id } = route.params;

  const obtenerDatos = async () => {
    const data = await fetch("http://modulo-backoffice.herokuapp.com/families/x-test-obtain-resumed-family/"+ id)
    const response = await data.json()
    setInformation(response)
  }

  useEffect( () => {
    obtenerDatos()
  }, [navigation])

  return (
    <View>
      <Text>Aca van las fotos de la familia {id}</Text>
      <Image source={{uri: 'https://drive.google.com/thumbnail?id=1bDYTk5uvJTE3_bvTQ1TjnzmhZ3Va0Xib'}} alt={"Doesn't work"}
       style={{width: 400, height: 400}} />
    </View>
  );

}

function FamiliesScreen ({navigation}) {

  const [ usuarios, setUsuarios ] = useState();

  useEffect( () => {
    console.log('useEffect')
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    const data = await fetch("http://modulo-backoffice.herokuapp.com/families/x-test-obtain-families")
    const users = await data.json()
    setUsuarios(users.results)
  }

  return (
    <View style={styles.container_style}>
      <FlatList keyExtractor={(item) => item._id} data={usuarios} renderItem={ ({item}) => <TouchableHighlight onPress={() => navigation.navigate('Family', {id: item._id})}><FamilyInfoCard item={item}/></TouchableHighlight>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container_style: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  }, header: {
    textAlign: 'center',
    backgroundColor: '#222c3c',
    padding: 20,
    fontSize: 20,
    color: 'white'
  }
});

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Iniciar Sesion" component={GoogleLogIn} />
      <Stack.Screen name="Families" component={FamiliesScreen} />
      <Stack.Screen name="Family" component={FamilyScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
