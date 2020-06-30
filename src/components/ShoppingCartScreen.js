/* eslint-disable prettier/prettier */
//import liraries
//import libraries
import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem, List, ListItem} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Constants from '../constant/Constants';
import AsyncStorage from '@react-native-community/async-storage';

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back'/>
);

const emptyIcon = (props) => (
  <Icon {...props} animation='zoom' name='shopping-cart-outline'/>
);

// create a component
const ShoppingCartScreen = ({navigation}) => {
    const [dataProducts, setdataProducts] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={()=>backAction()}/>;
  /*const data = new Array(8).fill({
    title: 'Item',
    description: 'Description for Item',
  });*/

  const backAction = () =>{
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.name}`}
      description={`${String(item.description).replace(/<(.|\n)*?>/g, '')}`}
    />
  );

  React.useEffect(()=>{
    let t = 0;
    const getProducts = async () =>{
        try {
          let prodArray = JSON.parse(await AsyncStorage.getItem('shopCart'));
          if (prodArray !== null)
          {
            let result = prodArray.reduce(function (r, a) {
              r[a.id] = r[a.id] || [];
              r[a.id].push(a);
              return r;
            }, {});

            let products = Object.values(result);

            for (var i = 0; i < products.length; i++)
            {
              t = parseFloat(t) + (parseFloat(products[i].length) * parseFloat(products[i][0].price));
            }

            setTotal(Number.parseFloat(t).toFixed(2));

            //setdataProducts(...dataProducts,JSON.parse(await AsyncStorage.getItem('shopCart')));
            setdataProducts(...dataProducts,products);
            //console.log(await AsyncStorage.getItem('shopCart'));
          }
          setLoading(false);
        }
        catch (e) {
          console.log("Error shoping list " + e);
        }
    };
    getProducts();
  },[]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <IconRegistry icons={EvaIconsPack} />
      <TopNavigation title="Products" subtitle="My selected products" alignment="center" accessoryLeft={renderBackAction} />
      <Divider />
      {
        dataProducts.length > 0 && loading === false ?
          (<Layout>
            <FlatList
            data={dataProducts}
            renderItem={({ item }) =>
              <View>
                <View style={{flex: 1, flexDirection: 'row', padding:15, backgroundColor:'#FFF'}}>
                  <View style={{width: '30%'}}>
                    <Image source={{uri: item[0].images[0].src}} style={styles.image}/>
                  </View>
                  <View style={{width: '70%'}}>
                    <Text>Product: {item[0].name}</Text>
                    <Text>Price: ${Number.parseFloat(item[0].price).toFixed(2)}</Text>
                    <Text>Quantity: {item.length}</Text>
                  </View>
                </View>
                <Divider />
              </View>
            }
            keyExtractor={item => String(item[0].id)}
          />
          <View style={{flex: 1, flexDirection: 'row', backgroundColor:'#FFF', height:80}}>
            <View style={{width:'70%'}}>
              <Text status='basic' style={{textAlign:'right'}}>TOTAL:</Text>
            </View>
            <View style={{width:'30%'}}>
              <Text status='info' style={{textAlign:'center'}}>${total}</Text>
            </View>
          </View>
          </Layout>)
        : dataProducts.length === 0 && loading === false ?
        (
          <Layout style={styles.container}>
            <Text category='h5' appearance='hint'>No products in the cart.</Text>
            <Text>&nbsp;</Text>
            <Button appearance='outline' accessoryLeft={emptyIcon} onPress={()=>backAction()}>
              Go to shopping
            </Button>
          </Layout>
        )
        :
        (
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Spinner status='info' size='giant'/>
          </Layout>
        )
      }
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#efefef',
  }
});

//make this component available to the app
export default ShoppingCartScreen;
