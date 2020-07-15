/* eslint-disable prettier/prettier */
//HOST VALUES
export const URL = 'http://itluma.com/';
export const CLIENT_KEY = 'ck_0dc52c14d952b11413af77c6b969149cc97f866e';
export const CLIENT_SECRET = 'cs_7475adc4da4711639669c2d1fd3d875d64bf7169';
export const ENCRYPTION_METHOD = 'HMAC-SHA1';

//API WOOCOMMERCE
export const GET_PRODUCTS = 'wp-json/wc/v3/products';
export const CREATE_ORDER = 'wp-json/wc/v3/orders';
export const GET_COUNTRIES = 'wp-json/wc/v3/data/countries';
export const GET_COUNTRY_DATA = 'wp-json/wc/v3/data/countries/'; // add country code

//ELASTIC SEARCH INFO
export const ELASTIC_SEARCH_HOST = 'https://oin-us-east-1.searchly.com/';
export const ELASTIC_SEARCH_INDEX = 'test_store';
export const ELASTIC_SECRET = 'site:acd061447191465f1f19179a8a2aee4a';