import React from 'react';
import {StyleSheet, SafeAreaView, FlatList, View, Image,ScrollView } from 'react-native';
import {Layout, Text, Button, Icon, IconRegistry, TopNavigation, Divider, Spinner, TopNavigationAction, OverflowMenu, MenuItem} from '@ui-kitten/components';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as Constants from "../constant/Constants";



// create a component
const ItemRelated = ({route, navigation}) => {
    // const { navigation } = this.props;
    const {item} = route.params;
    const [dataRelated, setdataRelated] = React.useState([]);


    const BackIcon = (props) => (
        <Icon {...props} name='arrow-back' />
    );
    const BackAction = () => (

        <TopNavigationAction icon={BackIcon} onPress={() => {navigation.navigate('MainScreen')}}/>
    );
    const regex = /(<([^>]+)>)/ig;

    const re = () =>{
        for(let i= 0; i < item.related_ids.length; i ++ ) {

            const it = item.related_ids[i];
            // console.log(it)

            const oauth_consumer_key = 'ck_0dc52c14d952b11413af77c6b969149cc97f866e';
            const oauth_nonce = Math.floor(Date.now() / 1000);
            const oauth_signature_method = 'HMAC-SHA1'
            let timeStamp = Math.floor(Date.now() / 1000);
            let url = Constants.URL + Constants.GET_PRODUCTS + '/' + it
            const concat = 'oauth_consumer_key=' + oauth_consumer_key + '&oauth_nonce=' + oauth_nonce + '&oauth_signature_method=' + oauth_signature_method + '&oauth_timestamp=' + timeStamp;
            let base_string = 'GET&' + encodeURIComponent(url) + '&' + encodeURIComponent(concat)
            let secret_key = 'cs_7475adc4da4711639669c2d1fd3d875d64bf7169'
            var hmacsha1 = require('hmacsha1')
            var oauth_signature = hmacsha1(secret_key + '&', base_string);
            // let oauth_signature = base64.encode('sha1',secret_key, base_string).trim();kkddzs
            let testable_url = url + '?' + concat + '&oauth_signature=' + oauth_signature
            //
            //
            // console.log(testable_url)

            fetch(testable_url, {
                method: 'GET',
            })
                .then((response) => response.json())
                .then((response) => {
                    setdataRelated([...dataRelated, response]);
                    // alert(JSON.stringify(response));
                    // alert(dataRelated[i].id)
                })
                .catch((error) => {
                    alert(error);
                    // console.log(urlFetch)zs
                });

        }
    }


    React.useEffect(()=>{
        re();

    },[]);
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <TopNavigation title={item.name} alignment='center' accessoryLeft={BackAction}/>
                <Divider/>

                {dataRelated.length > 0 ? (
                    <ScrollView>
                        <Layout >
                            <View  >
                                <FlatList
                                    data={dataRelated}
                                    numColumns={2}
                                    renderItem={({item}) => (
                                        <View style={{flex: 1, flexDirection: 'row', padding: 5}}  >
                                            <View
                                                style={{width: '100%',height: 250,backgroundColor: '#FFF',borderColor: '#bdbdbd',borderRadius: 5,borderWidth: 1,padding: 5,}}>
                                                <View
                                                    style={{alignContent: 'center',alignItems: 'center',marginTop: 5,}} >
                                                    <Image source={{uri: route.source}}
                                                           style={styles.imageR}
                                                    />
                                                </View>
                                                <Text
                                                    onPress={() => {
                                                        navigation.navigate('Details', {
                                                            item: item,})}}

                                                    style={{textAlign: 'center'}} category="h6" >
                                                    {item.name}
                                                </Text>
                                                {/*<Details name={item.name}/>*/}
                                                <Text style={{textAlign: 'center'}} category="s2">
                                                    $ {item.price}
                                                </Text>
                                                <Text style={{textAlign: 'center'}} category="s2">
                                                    &nbsp;
                                                </Text>
                                                <Button
                                                    status="primary"
                                                    appearance="outline"
                                                    // accessoryLeft={cartIcon}
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
                    </ScrollView>
                ) : (
                    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Spinner status='info' size='giant'/>
                    </Layout>
                )}


            </ScrollView>
        </SafeAreaView>


    )}
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
        flex: 1,
        flexDirection: 'row',
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default ItemRelated;