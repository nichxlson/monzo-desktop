import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import accounts from './accounts';

Vue.use(Vuex);

const store = () => new Vuex.Store({
    modules: {
        auth,
        accounts,
    }
});

export default store;
