/* eslint-disable prettier/prettier */
//import libraries
import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as Constants from '../constant/Constants';

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

// create a component
const MainScreen = () => {
  const [dataProducts, setdataProducts] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const getProducts = async => {
      let timeStamp = Math.floor(Date.now() / 1000);
      let url = Constants.URL + Constants.GET_PRODUCTS;
      let ck = Constants.CLIENT_KEY;
      let cs = Constants.CLIENT_SECRET;
      let method = Constants.ENCRYPTION_METHOD;
      let base_str = 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent('oauth_consumer_key=' + ck + '&oauth_nonce=' + timeStamp + '&oauth_signature_method='+ method + '&oauth_timestamp=' + timeStamp + '&page=1');
      var hmacsha1 = require('hmacsha1');
      var hash = hmacsha1(cs + '&', base_str);
      let urlFetch = url + '?oauth_consumer_key=' + ck + '&oauth_signature_method=' + method + '&oauth_timestamp=' + timeStamp + '&oauth_nonce=' + timeStamp + '&oauth_signature=' + hash;

      fetch(urlFetch + '&page=1', {
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

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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
        <MenuItem accessoryLeft={cartIcon} title="My cart" />
        <MenuItem accessoryLeft={checkOutIcon} title="Checkout" />
      </OverflowMenu>
    </React.Fragment>
  );

  React.useEffect(()=>{
      getProducts();
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
              numColumns={2}
              renderItem={({item}) => (
                <View style={{flex: 1, flexDirection: 'row', padding: 5}}>
                  <View
                    style={{width: '100%',height: 250,backgroundColor: '#FFF',borderColor: '#bdbdbd',borderRadius: 5,borderWidth: 1,padding: 5,}}>
                    <View
                      style={{alignContent: 'center',alignItems: 'center',marginTop: 5,}}>
                      <Image
                        source={{uri: item.images[0].src}}
                        style={styles.image}
                      />
                    </View>
                    <Text style={{textAlign: 'center'}} category="h6">
                      {item.name}
                    </Text>
                    <Text style={{textAlign: 'center'}} category="s2">
                      $ {item.price}
                    </Text>
                    <Text style={{textAlign: 'center'}} category="s2">
                      &nbsp;
                    </Text>
                    <Button
                      status="primary"
                      appearance="outline"
                      accessoryLeft={cartIcon}
                      size="medium"
                      onPress={() => alert('agrega al carro')}>
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
