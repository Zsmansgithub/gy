import Vue from 'vue';
import axios from 'axios';
import stores from '../store/index';

Vue.prototype.$http = axios;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.API_ROOT_MAIN;

axios.interceptors.request.use(function (config) {
    !config.unLoading && stores.dispatch('showloader');
    return config;
}, function (err) {
    return Promise.reject(err);
});
axios.interceptors.response.use(function (response) {
    stores.dispatch('hideloader');
    return response;
}, function (err) {
    stores.dispatch('hideloader');
    return Promise.reject(err);
});

export default {
};
