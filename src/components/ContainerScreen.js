/* eslint-disable prettier/prettier */
//import libraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  Image
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import * as Constants from '../constant/Constants';

// create a component
const ContainerScreen = () => {

    const [dataProducts, setdataProducts] = React.useState([]);
    const [page, setPage] = React.useState(1);

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
    }

    React.useEffect(()=>{
        getProducts();
    },[]);
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
          <View style={styles.body}>
            {/*<Text>{dataProducts.length}</Text>*/}
            <FlatList
              data={dataProducts}
              numColumns={2}
              renderItem={({item}) => 
              <View style={{flex: 1, flexDirection: 'row', padding:5}}>
	              <View style={{width: '100%', height: 250, backgroundColor: '#FFF', borderColor:'#bdbdbd', borderRadius:5, borderWidth:1, padding:5}}>
                  <View style={{alignContent:'center',alignItems:'center', marginTop:5}}> 
                    <Image source={{uri:item.images[0].src}} style={styles.image}/>
                  </View>
		              <Text style={{textAlign:'center'}}>{item.name}</Text>
	              </View>
              </View>}
              keyExtractor={(item) => String(item.id)}
            />
          </View>
      </SafeAreaView>
    </>
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
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    //paddingLeft:5,
    //paddingRight: 5
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

//make this component available to the app
export default ContainerScreen;
