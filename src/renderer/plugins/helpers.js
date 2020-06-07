import Vue from 'vue';

export const helpers = {
    getAccountName(account) {
        switch(account.type) {
            case 'uk_retail': {
                return 'Personal account';
                break;
            }

            case 'uk_retail_joint': {
                return 'Joint account';
                break;
            }

            default: {
                return account.description;
            }
        }
    }
};

Vue.helpers = helpers;
Vue.prototype.$helpers = helpers;
