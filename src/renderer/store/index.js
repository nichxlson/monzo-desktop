import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import accounts from './accounts';
import transactions from './transactions';

Vue.use(Vuex);

const store = () => new Vuex.Store({
    modules: {
        auth,
        accounts,
        transactions,
    }
});

export default store;
