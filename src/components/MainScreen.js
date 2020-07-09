/* eslint-disable prettier/prettier */
//import libraries
import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Constants from '../constant/Constants';
import Details from './Details';
import AsyncStorage from '@react-native-community/async-storage';
import {CartContext} from '../constant/Context';
import analytics from '@react-native-firebase/analytics';

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
  const [shoppingCart, setShoppingCart] = React.useContext(CartContext);
  const [pendingProcess, setPendingProcess] = React.useState(true);
  const [loadmore, setLoadmore] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

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

    await fetch(urlFetch + '&page=' + parseInt(p), {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.length > 0)
      {
        setdataProducts([...dataProducts,...response]);
        setPendingProcess(true);
      }
      else
      {
        setPendingProcess(false);
      }
    })
    .catch((error) => {
        alert(error);
    });
    setRefresh(false);
  };

  const addToCart = async (i) => {
    setShoppingCart([...shoppingCart,i]);
    await AsyncStorage.setItem('startShopping','add');
  };

  const clearCart = async () =>{
    setShoppingCart([]);
    await AsyncStorage.setItem('startShopping','clear');
    toggleMenu();
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const goToMyCart = () =>{
    setMenuVisible(!menuVisible);
    navigation.navigate('ShoppingCartScreen');
  };

  const handleLoadMore = () => {
    if (pendingProcess === true)
    {
      setPage(page + 1);
    }
  };

  const onRefresh = () => {
    setdataProducts([]);
    setPage(1);
    setRefresh(true);
    setPendingProcess(true);
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
        {/*<MenuItem accessoryLeft={checkOutIcon} title="Checkout" />*/}
        <MenuItem accessoryLeft={clearIcon} title="Clear cart" onPress={()=>clearCart()}/>
      </OverflowMenu>
    </React.Fragment>
  );

  React.useEffect(()=>{
    getProducts(page);
  },[page]);

  React.useEffect(()=>{
    if (refresh === true) { getProducts(page); }
  },[refresh]);

  React.useEffect(()=>{
  },[dataProducts]);

  React.useEffect(()=>{
    const storeProduct = async (totProd) =>{
      let valueShop;
      if (totProd > 0 )
      {
        await AsyncStorage.setItem('shopCart',JSON.stringify(shoppingCart));
      }
      else
      {
        valueShop = await AsyncStorage.getItem('startShopping');
        if (valueShop !== null && valueShop === 'clear')
        {
          await AsyncStorage.setItem('shopCart','');
        }
      }
    };
    storeProduct(shoppingCart.length);
  },[shoppingCart]);

  React.useEffect(()=>{
    const initVars = async () =>{
      await AsyncStorage.setItem('startShopping','yes');
      let productsList = JSON.parse(await AsyncStorage.getItem('shopCart'));
      if (productsList !== null)
      {
        setShoppingCart(...shoppingCart,productsList);
      }
    };
    initVars();
    getProducts(page);
    analytics().logEvent('openApp',
    {
      Event: 'Open app',
      description: 'Load products',
    });
  },[]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <IconRegistry icons={EvaIconsPack} />
      <TopNavigation title='Woocomerce' subtitle='Shop' alignment='center' accessoryRight={renderRightActions}/>
      <Divider />
      {dataProducts.length > 0 ? (
        <Layout>
          <View>
            <FlatList
              data={dataProducts}
              contentContainerStyle={{paddingBottom: 70}}
              numColumns={2}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              onRefresh={() => onRefresh()}
              refreshing={refresh}
              renderItem={({item}) => (
                <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                  <View onPress={() => { navigation.navigate('Details', {item: item});}} style={{width: '100%',backgroundColor: '#FFF',borderColor: '#bdbdbd',borderRadius: 5,borderWidth: 1,padding: 5}}>
                    <View style={{alignContent: 'center',alignItems: 'center',marginTop: 5,}}>
                    <Image source={{uri: item.images.length > 0 ? item.images[0].src : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png'}} style={styles.image}/>
                    </View>
                    <Text onPress={() => {navigation.navigate('Details', {item: item});}} style={{textAlign: 'center'}} category="h6" >
                      {item.name}
                    </Text>
                    <Text style={{textAlign: 'center'}} category="s2">
                      $ {isNaN(Number.parseFloat(item.price).toFixed(2)) === false ? Number.parseFloat(item.price).toFixed(2) : Number.parseFloat(0).toFixed(2)}
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
              ListFooterComponent={pendingProcess === true ? <View style={{justifyContent: 'center', alignItems: 'center'}}><Spinner status='info' size='small'/></View> : null}
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
