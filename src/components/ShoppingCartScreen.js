/* eslint-disable prettier/prettier */
//import liraries
//import libraries
import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem, List, ListItem, Modal, Card} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Constants from '../constant/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import {CartContext} from '../constant/Context';

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back'/>
);

const emptyIcon = (props) => (
  <Icon {...props} animation='zoom' name='shopping-cart-outline'/>
);

const checkOutIcon = (props) => (
  <Icon {...props} name='arrow-forward-outline'/>
);

// create a component
const ShoppingCartScreen = ({navigation}) => {
    const [dataProducts, setdataProducts] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [visibleModal, setVisibleModal] = React.useState(false);
    const [shoppingCart, setShoppingCart] = React.useContext(CartContext);

  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={()=>backAction()}/>;

  const backAction = () =>{
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.name}`}
      description={`${String(item.description).replace(/<(.|\n)*?>/g, '')}`}
    />
  );

  const clearCart = async () =>{
    setdataProducts([]);
    setShoppingCart([]);
    await AsyncStorage.setItem('shopCart','');
    await AsyncStorage.setItem('startShopping','clear');
    await AsyncStorage.setItem('purchased','yes');
    console.log('shopCart => ' + await AsyncStorage.getItem('shopCart') + ' startShopping => ' + await AsyncStorage.getItem('startShopping'));
  };

  const purchaseProduct = (productsList) =>
  {
    //The below variable contains dummy info
    let orderDetails = {"payment_method":"bacs","payment_method_title":"Direct Bank Transfer","set_paid":true,"billing":{"first_name":"Android","last_name":"User","address_1":"969 Market","address_2":"","city":"San Francisco","state":"CA","postcode":"94103","country":"US","email":"user@android.com","phone":"(555) 555-5555"},"shipping":{"first_name":"Android","last_name":"User","address_1":"969 Market","address_2":"","city":"San Francisco","state":"CA","postcode":"94103","country":"US"},"shipping_lines":[{"method_id":"flat_rate","method_title":"Flat Rate","total":"10"}]};
    let productItems = [];
    for (var i = 0; i < productsList.length; i++)
    {
      let item = {'product_id':productsList[i][0].id,'quantity':productsList[i].length};
      productItems.push(item);
    }
    orderDetails.line_items = productItems;

    let timeStamp = Math.floor(Date.now() / 1000);
    let url = Constants.URL + Constants.CREATE_ORDER;
    let ck = Constants.CLIENT_KEY;
    let cs = Constants.CLIENT_SECRET;
    let method = Constants.ENCRYPTION_METHOD;
    let base_str = 'POST&' + encodeURIComponent(url) + '&' + encodeURIComponent('oauth_consumer_key=' + ck + '&oauth_nonce=' + timeStamp + '&oauth_signature_method='+ method + '&oauth_timestamp=' + timeStamp);
    var hmacsha1 = require('hmacsha1');
    var hash = hmacsha1(cs + '&', base_str);
    let urlFetch = url + '?oauth_consumer_key=' + ck + '&oauth_signature_method=' + method + '&oauth_timestamp=' + timeStamp + '&oauth_nonce=' + timeStamp + '&oauth_signature=' + hash;

    fetch(urlFetch, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
    .then((response) => response.json())
    .then((response) => {
        if (response.hasOwnProperty('id'))
        {
          clearCart();
          setVisibleModal(true);
        }
    })
    .catch((error) => {
        alert(error);
    });

  };

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
            setdataProducts(...dataProducts,products);
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
      <TopNavigation
        title="Products"
        subtitle="My selected products"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Modal visible={visibleModal}>
        <Card disabled={true}>
          <Text>Purchase order complete</Text>
          <Button onPress={() => setVisibleModal(false)}>DISMISS</Button>
        </Card>
      </Modal>
      {dataProducts.length > 0 && loading === false ? (
        <Layout>
          <FlatList
            contentContainerStyle={{paddingBottom: 70}}
            data={dataProducts}
            renderItem={({item}) => (
              <View>
                <View
                  style={{flex: 1, flexDirection: 'row', padding: 15, backgroundColor: '#FFF'}}>
                  <View style={{width: '30%'}}>
                    <Image source={{uri: item[0].images[0].src}} style={styles.image}/>
                  </View>
                  <View style={{width: '70%'}}>
                    <Text>Product: {item[0].name}</Text>
                    <Text>
                      Price: ${Number.parseFloat(item[0].price).toFixed(2)}
                    </Text>
                    <Text>Quantity: {item.length}</Text>
                  </View>
                </View>
                <Divider />
              </View>
            )}
            keyExtractor={(item) => String(item[0].id)}
            ListFooterComponent={
              <View>
                <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#FFF'}}>
                  <View style={{width: '70%'}}>
                    <Text status="basic" style={{textAlign: 'right'}}>
                      TOTAL:
                    </Text>
                  </View>
                  <View style={{width: '30%'}}>
                    <Text status="info" style={{textAlign: 'center'}}>
                      ${total}
                    </Text>
                  </View>
                </View>
                <View style={{alignContent: 'center', alignItems: 'center', paddingTop: 15}}>
                  <Button
                    status="basic"
                    appearance="outline"
                    accessoryRight={checkOutIcon}
                    onPress={() => purchaseProduct(dataProducts)}>
                    Checkout
                  </Button>
                </View>
              </View>
            }
          />
        </Layout>
      ) : dataProducts.length === 0 && loading === false ? (
        <Layout style={styles.container}>
          <Text category="h5" appearance="hint">
            No products in the cart.
          </Text>
          <Text>&nbsp;</Text>
          <Button
            appearance="outline"
            accessoryLeft={emptyIcon}
            onPress={() => backAction()}>
            Go to shopping
          </Button>
        </Layout>
      ) : (
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner status="info" size="giant" />
        </Layout>
      )}
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
