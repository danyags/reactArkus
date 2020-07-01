/* eslint-disable prettier/prettier */
//import libraries
import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Constants from '../constant/Constants';
import Details from './Details';
import AsyncStorage from '@react-native-community/async-storage';

const cartIcon = (props) =>(
  //<Icon style={{width:24,height:24}} fill='#000' name='shopping-cart-outline'></Icon>
  <Icon {...props} name='shopping-cart-outline'/>
);

const MenuIcon = (props) => (
  <Icon {...props} name='more-vertical'/>
);

const InfoIcon = (props) => (
  <Icon {...props} name='info'/>
);

const checkOutIcon = (props) => (
  <Icon {...props} name='checkmark-outline'/>
);

const clearIcon = (props) => (
  <Icon {...props} name='close-outline'/>
);

// create a component
const MainScreen  = ({navigation})  => {
  const [dataProducts, setdataProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [cart,setCart] = React.useState([]);

  const getProducts = async (p) => {
      let timeStamp = Math.floor(Date.now() / 1000);
      let url = Constants.URL + Constants.GET_PRODUCTS;
      let ck = Constants.CLIENT_KEY;
      let cs = Constants.CLIENT_SECRET;
      let method = Constants.ENCRYPTION_METHOD;
      let base_str = 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent('oauth_consumer_key=' + ck + '&oauth_nonce=' + timeStamp + '&oauth_signature_method='+ method + '&oauth_timestamp=' + timeStamp + '&page=' + parseInt(p));
      var hmacsha1 = require('hmacsha1');
      var hash = hmacsha1(cs + '&', base_str);
      let urlFetch = url + '?oauth_consumer_key=' + ck + '&oauth_signature_method=' + method + '&oauth_timestamp=' + timeStamp + '&oauth_nonce=' + timeStamp + '&oauth_signature=' + hash;

      fetch(urlFetch + '&page=' + parseInt(p), {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((response) => {
          setdataProducts([...dataProducts,...response]);
          //alert(JSON.stringify(response));
      })
      .catch((error) => {
          alert(error);
      });
  };

  const addToCart = async (i) => {
    setCart([...cart,i]);
    await AsyncStorage.setItem('startShopping','add');
    /*try {
      let products = JSON.stringify(cart);
      await AsyncStorage.setItem('shopCart',products);
      let t = JSON.parse(await AsyncStorage.getItem('shopCart'));
      console.log('TOTAL CART = ' + t.length);
      //console.log(await AsyncStorage.getItem('shopCart'));
    }
    catch (e){
      console.log("Error addStorage=" + e);
    }*/
  };

  const clearCart = async () =>{
    setCart([]);
    await AsyncStorage.setItem('startShopping','clear');
    toggleMenu();
    //await AsyncStorage.removeItem('addedProduct');
    /*try {
      let products = '';
      await AsyncStorage.setItem('shopCart',products);
      //console.log(await AsyncStorage.getItem('shopCart'));
    }
    catch (e){
      console.log("Error clearStorage=" + e);
    }*/
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const goToMyCart = () =>{
    setMenuVisible(!menuVisible);
    navigation.navigate('ShoppingCartScreen');
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu}/>
  );

  const renderRightActions = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem accessoryLeft={cartIcon} title="My cart" onPress={()=>goToMyCart()}/>
        <MenuItem accessoryLeft={checkOutIcon} title="Checkout" />
        <MenuItem accessoryLeft={clearIcon} title="Clear cart" onPress={()=>clearCart()}/>
      </OverflowMenu>
    </React.Fragment>
  );

  React.useEffect(() => {
    /*const addToStorage = async () =>{
      let t;
      try {
        let products = JSON.stringify(cart);
        await AsyncStorage.setItem('shopCart',products);
        t = JSON.parse(await AsyncStorage.getItem('shopCart'));
        console.log(t.length);
      }
      catch (e) {
        console.log("Error AsyncStorage=" + e);
      }
    };
    addToStorage();*/

    /*const storageProduct = async () =>{
      let valueShop;
      let t;
      try {
        valueShop = await AsyncStorage.getItem('startShopping');
        if (valueShop !== null && valueShop === 'add' && cart.length > 0)
        {
          let products = JSON.stringify(cart);
          await AsyncStorage.setItem('shopCart',products);
          t = JSON.parse(await AsyncStorage.getItem('shopCart'));
          console.log('CART ' + t.length);
        }
        else
        {
          await AsyncStorage.setItem('shopCart','');
          t = JSON.parse(await AsyncStorage.getItem('shopCart'));
          console.log('CART ' + t);
        }
      }
      catch (e) {
        console.log("Error cart hook => " + e);
      }
    };*/

    //if (cart.length > 0) {storageProduct();}
    //storageProduct();

    const storeProduct = async (totProd) =>{
      let t;
      let valueShop;
      if (totProd > 0 )
      {
        await AsyncStorage.setItem('shopCart',JSON.stringify(cart));
        t = JSON.parse(await AsyncStorage.getItem('shopCart'));
        //console.log('CART ' + t.length);
      }
      else
      {
        valueShop = await AsyncStorage.getItem('startShopping');
        if (valueShop !== null && valueShop === 'clear')
        {
          await AsyncStorage.setItem('shopCart','');
          console.log("Empty cart");
        }
      }
    };
    storeProduct(cart.length);

    //console.log('Products=' + cart.length);
  }, [cart]);

  React.useEffect(()=>{
    const initVars = async () =>{
      await AsyncStorage.setItem('startShopping','yes');
      let productsList = JSON.parse(await AsyncStorage.getItem('shopCart'));
      if (productsList !== null)
      {
        //dataProducts(...dataProducts,Object.values(productsList));
        //console.log("ASYNC PROD => " + productsList.length);
        setCart(...cart,productsList);
      }
    };
    initVars();
    getProducts(page);
  },[]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <IconRegistry icons={EvaIconsPack} />
      <TopNavigation title='Woocomerce' subtitle='Shop' alignment='center' accessoryRight={renderRightActions}/>
      <Divider />
      {dataProducts.length > 0 ? (
        <Layout>
          <View>
            {/*<Text onPress={()=>clearCart()}>HOLA</Text>*/}
            <FlatList
              data={dataProducts}
              numColumns={2}
              renderItem={({item}) => (
                <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                  <View onPress={() => {
                      navigation.navigate('Details', {
                          item: item,})}}
                    style={{width: '100%',height: 250,backgroundColor: '#FFF',borderColor: '#bdbdbd',borderRadius: 5,borderWidth: 1,padding: 5,}}>
                    <View
                      style={{alignContent: 'center',alignItems: 'center',marginTop: 5,}}>
                      <Image

                        source={{uri: item.images[0].src}}
                        style={styles.image}
                      />
                    </View>
                    <Text
                        onPress={() => {
                            navigation.navigate('Details', {
                                item: item,})}}
                        style={{textAlign: 'center'}} category="h6" >
                      {item.name}
                    </Text>
                    <Text style={{textAlign: 'center'}} category="s2">
                      $ {Number.parseFloat(item.price).toFixed(2)}
                    </Text>
                    <Text style={{textAlign: 'center'}} category="s2">
                      &nbsp;
                    </Text>
                    <Button
                      status="primary"
                      appearance="outline"
                      accessoryLeft={cartIcon}
                      size="medium"
                      onPress={() => addToCart(item)}>
                      Add to cart
                    </Button>
                  </View>
                </View>
              )}
              keyExtractor={(item) => String(item.id)}
            />
          </View>
        </Layout>
      ) : (
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner status='info' size='giant'/>
        </Layout>
      )}
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#efefef'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default MainScreen;
