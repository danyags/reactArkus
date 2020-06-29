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
    const getProducts = async () =>{
        try {
          /*let p = JSON.parse(await AsyncStorage.getItem('shopCart'));
          let result = p.reduce(function (r, a) {
            r[a.id] = r[a.id] || [];
            r[a.id].push(a);
            return r;
          }, {});*/
          //console.log(result);

          setdataProducts(...dataProducts,JSON.parse(await AsyncStorage.getItem('shopCart')));
          //setdataProducts(...dataProducts,result);
          console.log(await AsyncStorage.getItem('shopCart'));
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
        dataProducts !== null ?
          (<Layout>
            <List /*style={styles.container}*/ data={dataProducts} ItemSeparatorComponent={Divider} renderItem={renderItem}/>
          </Layout>)
        :
        (<Layout style={styles.container}>
          <Text category='h5' appearance='hint'>No products in the cart.</Text>
          <Text>&nbsp;</Text>
          <Button appearance='outline' accessoryLeft={emptyIcon} onPress={()=>backAction()}>
          Go to shopping
          </Button>
        </Layout>)
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
});

//make this component available to the app
export default ShoppingCartScreen;
