/* eslint-disable prettier/prettier */
import * as Constants from './Constants';

//var hmacsha1 = require('hmacsha1');

export function createSignWithOutParams(endPoint, strMethod){
    var hmacsha1 = require('hmacsha1');
    let timeStamp = Math.floor(Date.now() / 1000);
    let url = String(endPoint);
    let ck = Constants.CLIENT_KEY;
    let cs = Constants.CLIENT_SECRET;
    let method = Constants.ENCRYPTION_METHOD;
    let base_str = String(strMethod) + '&' + encodeURIComponent(url) + '&' + encodeURIComponent('oauth_consumer_key=' + ck + '&oauth_nonce=' + timeStamp + '&oauth_signature_method='+ method + '&oauth_timestamp=' + timeStamp);
    var hash = hmacsha1(cs + '&', base_str);
    let urlFetch = '?oauth_consumer_key=' + ck + '&oauth_signature_method=' + method + '&oauth_timestamp=' + timeStamp + '&oauth_nonce=' + timeStamp + '&oauth_signature=' + hash;
    return urlFetch;
}

export function fetchCountries(){
    let urlFetch = createSignWithOutParams(Constants.URL + Constants.GET_COUNTRIES, 'GET');
    return fetch(Constants.URL + Constants.GET_COUNTRIES + urlFetch, {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.log('Error getting countries => ' + error);
    });
}

export function getCountryData(code){
    var hmacsha1 = require('hmacsha1');
    let timeStamp = Math.floor(Date.now() / 1000);
    let base_str = 'GET&' + encodeURIComponent(Constants.URL + Constants.GET_COUNTRY_DATA + String(code)) + '&' + encodeURIComponent('oauth_consumer_key=' + Constants.CLIENT_KEY + '&oauth_nonce=' + timeStamp + '&oauth_signature_method=' + Constants.ENCRYPTION_METHOD + '&oauth_timestamp=' + timeStamp);
    var hash = hmacsha1(Constants.CLIENT_SECRET + '&', base_str);
    let urlFetch = '?oauth_consumer_key=' + Constants.CLIENT_KEY + '&oauth_signature_method=' + Constants.ENCRYPTION_METHOD + '&oauth_timestamp=' + timeStamp + '&oauth_nonce=' + timeStamp + '&oauth_signature=' + hash;
    return fetch(Constants.URL + Constants.GET_COUNTRY_DATA + String(code) + urlFetch, {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.log('Error getting country data => ' + error);
    });
}

/*export function addEventToElastic(data){
    return fetch(Constants.ELASTIC_SEARCH_HOST + Constants.ELASTIC_SEARCH_INDEX + '/_doc', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((response) => {
        return response;
    })
    .catch((error) => {
        console.log('Error saving event on ElasticSearch => ' + error);
    });   
}*/

export async function addEventToElastic(data){
    try {
        const response = await fetch(Constants.ELASTIC_SEARCH_HOST + Constants.ELASTIC_SEARCH_INDEX + '/_doc', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.log('Error saving event on ElasticSearch => ' + error);
    }   
}