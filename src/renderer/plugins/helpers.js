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
    },

    convertAmount(amount, currency) {
        const formatter = new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency ?? 'GBP',
            minimumFractionDigits: 2
        });

        return formatter.format(amount / 100);
    }
};

Vue.helpers = helpers;
Vue.prototype.$helpers = helpers;
