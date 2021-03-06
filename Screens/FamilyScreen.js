import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList, SafeAreaView, ActivityIndicator} from 'react-native';
import AppButton from '../Components/AppButton';
import asyncStorageHelper from '../Helpers/asyncStorageHelper';
import Category from '../Components/Category';
import Icon from 'react-native-vector-icons/AntDesign';


const { width, height } = Dimensions.get('window');

export default function FamilyScreen({ navigation, route }) {
    const [ information, setInformation ] = useState({});
    const [ categories, setCategories ] = useState({});
    const [ token, setToken ] = useState('');
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const  id  = route.params.id;


    navigation.setOptions({
      headerRight: () => {
        return (  <Icon size={30} onPress={() => { setModalVisible(true) }} name='reload1' onPress={ () => {setRefresh(refresh+1)} } />)
      }
    })

    const obtenerDatos = async () => {
      jwt = await asyncStorageHelper.obtenerToken()
      setToken(jwt)

      https_options_back = { 
        method: 'get', 
        headers: { 'Authorization': jwt }
      }

      const data = await fetch("http://modulo-backoffice.herokuapp.com/families/obtain-resumed-family/"+ id, https_options_back)
      const dataCategories = await fetch("https://modulo-sanitario-imagenes-db.herokuapp.com/families/image/ordered/categories/"+id, https_options_back)

      const response = await data.json()
      const responseCategories = await dataCategories.json()

      setInformation(response)

      responseCategories.categories.sort((A,B)=>{ return !A.flag })
      setCategories(responseCategories)
      setLoading(false)
      
    }

    useEffect( () => {
      obtenerDatos()
    }, [navigation, refresh])

    const renderCategory = ({ item }) => (
      <Category navigation={navigation} id={id} item={item} token={token} ></Category>
    );

    return (
      
    <SafeAreaView>
      {loading ? (
          <ActivityIndicator
            size="large" color="#0000ff"
            visible={loading}
            textContent={'Loading...'}
            style={{
            height:height-50,
            width:width,
            }}/>) 
          : (
          <FlatList ListHeaderComponent={ 
            <View style={styles.familyInfoContainer}>
            <Text style={styles.infoFamilyName} >{'Familia ' + information.apellido}</Text>
              <View style={{marginBottom:10}}>
                <Text style={styles.infoDescriptionFamily} >{information.estado}</Text>
              </View>
            <AppButton title={'Ver mapa'} onPress={()=>{navigation.navigate('Map',id)}}/>
          </View>} 
            data={categories.categories} 
            renderItem={renderCategory}
            keyExtractor={(item) => item.name.spanish} />)}

      
    </SafeAreaView>
    );
  
  }

  const styles = StyleSheet.create({
    familyInfoContainer:{
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: 230,
      borderColor: '#cccccc',
      borderWidth: 0.5,
      borderRadius: 20,
      backgroundColor:'white'
    },
    categoriesInfo: {
      marginTop: 3,
      marginBottom: 5
    },
    container: {
      backgroundColor: 'white',
    },
    category: {
      fontSize: 14,
      fontWeight: 'bold',
      margin: 10,
      color: '#2cd18a'
    },
    infoDescriptionFamily: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 16,
      marginTop:5,
      textAlign:'center'
    },
    infoFamilyName: {
      fontSize: 28,
      margin: 10,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center'
    }
  });
