/* eslint-disable prettier/prettier */
//import libraries

import React from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    Image,
    ScrollView,
    VirtualizedList,
    TouchableOpacity,
    ToastAndroid,
    Platform
} from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem} from '@ui-kitten/components';
import { createStackNavigator } from '@react-navigation/stack';
import * as Constants from "../constant/Constants";
import AsyncStorage from "@react-native-community/async-storage";
import {CartContext} from "../constant/Context";
import analytics from "@react-native-firebase/analytics";
import Moment from "moment";
import * as cmFunction from "../constant/CommonFunctions";


const Details = ({route, navigation}) => {
    var {item} = route.params;
    const [dataRelated, setdataRelated] = React.useState([]);
    //const [dataNewRel, setdataNewRel] = React.useState([]);
    //const [item1, setItem] = React.useState();
    //const [itemId, setItemId] = React.useState();
    //const [isLoaded, setIsLoaded] = React.useState(false);
    const [shoppingCart, setShoppingCart] = React.useContext(CartContext);
    const [element, setElement] = React.useState(item);
    //const [flag, setFlag] = React.useState(false);

    const BackIcon = (props) => (
        <Icon {...props} name='arrow-back' />
    );
    const BackAction = () => (

        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.navigate('MainScreen')}}/>
    );
    const regex = /(<([^>]+)>)/ig;

    const related = async () =>{
        let related = [];
        for (let i = 0; i < element.related_ids.length; i++)
        {
            const oauth_consumer_key = Constants.CLIENT_KEY;
            const oauth_nonce = Math.floor(Date.now() / 1000) + [i];
            const oauth_signature_method = 'HMAC-SHA1'
            let timeStamp = Math.floor(Date.now() / 1000);
            let url = Constants.URL + Constants.GET_PRODUCTS + '/' + element.related_ids[i]
            const concat = 'oauth_consumer_key=' + oauth_consumer_key + '&oauth_nonce=' + oauth_nonce + '&oauth_signature_method=' + oauth_signature_method + '&oauth_timestamp=' + timeStamp;
            let base_string = 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent(concat)
            let secret_key = Constants.CLIENT_SECRET;
            var hmacsha1 = require('hmacsha1')
            var oauth_signature = hmacsha1(secret_key + '&', base_string);
            let testable_url = url + '?' + concat + '&oauth_signature=' + oauth_signature;
            await fetch(testable_url, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    /*if(dataRelated.indexOf(response)===-1)
                    {
                        setdataRelated(dataRelated => [...dataRelated, response]);
                    }*/
                    related.push(response);
                    setdataRelated([...new Set(related)]);
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    const addToCart = async (i) => {
        setShoppingCart([...shoppingCart,i]);
        await AsyncStorage.setItem('startShopping','add');
    };

    const changeElement = async (i) => {
        setdataRelated([]);
        setElement(i);
        navigation.navigate('Details', { item: i, });
    };

    React.useEffect(()=>{
        related();
        analytics().logEvent('Details',{Event: 'See details',description: 'User See details',Platform: String(Platform.OS),Date:Moment().format(),Product_Id: element.id });
        cmFunction.addEventToElastic({'Event':'See details','Description':'User See details','Platform':String(Platform.OS),'Date':Moment().format(),'Product_Id': element.id});
    },[]);

    React.useEffect(()=>{
        related();
    },[element]);

    React.useEffect(()=>{
        // console.log('RELATED ' + dataRelated.length);
    },[dataRelated]);

    return (
        <SafeAreaView >
            <TopNavigation title={element.name} alignment='center' accessoryLeft={BackAction} />
            <Divider />
            <Layout>
                <ScrollView>
                    <View>
                        <View style={{ackgroundColor: '#FFF', borderColor: '#bdbdbd', borderRadius: 5, borderWidth: 1, padding: 5, }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', marginTop: 5, }} >
                                <Image source={{uri: element.images.length > 0 ? element.images[0].src : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png'}} style={styles.image} />
                            </View>
                            <Text style={{ textAlign: 'left', fontSize: 20 }}  >{element.name}</Text>
                            <Text style={{ textAlign: 'left', fontSize: 20 }} category="s2">
                                $ {isNaN(Number.parseFloat(element.price).toFixed(2)) === false ? Number.parseFloat(item.price).toFixed(2) : Number.parseFloat(0).toFixed(2)}
                            </Text>
                            <Text style={{ textAlign: 'center' }} category="s2">&nbsp;</Text>
                            <Button status='primary' appearance='outline' size='medium' onPress={() => addToCart(element)}>
                                Add to cart
                            </Button>
                            <Text style={{ paddingTop: 35 }}>AVAILABILITY: {element.stock_quantity} in stock</Text>
                            <Text style={{ fontSize: 20, paddingTop: 25 }}>Description</Text>
                            <Text style={{ paddingTop: 5 }}>{element.short_description.replace(regex, '')}</Text>
                            <Text style={{ paddingTop: 25, fontSize: 30 }}>Related Products</Text>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={dataRelated.length > 0 ? dataRelated : []}
                            numColumns={2}
                            contentContainerStyle={{ paddingBottom: '30%' }}
                            renderItem={({ item }) => (
                                <View style={{ flex: 1, flexDirection: 'row', padding: 5 }}>
                                    <View onPress={() => { navigation.navigate('Details', { item: item }) }} style={{ width: '100%', height: 250, backgroundColor: '#FFF', borderColor: '#bdbdbd', borderRadius: 5, borderWidth: 1, padding: 5, }}>
                                        <View style={{ alignContent: 'center', alignItems: 'center', marginTop: 5, }}>
                                            <Image source={{uri: item.images != null ? item.images[0].src : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png'}} style={styles.imageR} />
                                        </View>
                                        <Text onPress={() => {changeElement(item)}}
                                              style={{ textAlign: 'center' }} category="h6" >
                                            {item.name}
                                        </Text>
                                        <Text style={{ textAlign: 'center' }} category="s2">
                                            $ {isNaN(Number.parseFloat(item.price).toFixed(2)) === false ? Number.parseFloat(item.price).toFixed(2) : Number.parseFloat(0).toFixed(2)}
                                        </Text>
                                        <Text style={{ textAlign: 'center' }} category="s2">&nbsp;</Text>
                                        <Button status="primary" appearance="outline" size="medium" onPress={() => addToCart(item)}>
                                            Add to cart
                                        </Button>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item) => String(item.id)}
                        />
                    </View>
                </ScrollView>
            </Layout>
        </SafeAreaView>
    )
}
const Stack = createStackNavigator();
const styles = StyleSheet.create({
    imageR: {
        width: 120,
        height: 120,
        borderRadius: 150 / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#efefef'
    },
    image: {
        width: 200,
        height: 200,
    },
    container: {
        // flex: 1,
        // flexDirection: 'row',
    },
    layout: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Details;
