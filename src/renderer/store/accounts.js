const accounts = {
    state: {
        accounts: localStorage.getItem('accounts') ?? '[]',
        selected_account: localStorage.getItem('selected_account') ?? ''
    },

    mutations: {
        setAccounts(state, accounts) {
            state.accounts = accounts;
        },

        setSelectedAccount(state, account) {
            state.selected_account = account;
        }
    },

    actions: {
        getAccounts({ commit, getters }) {
            const access_token = getters.getAccessToken;

            return fetch(`https://api.monzo.com/accounts`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }).then(response => response.json()).then(result => {
                const accounts = JSON.stringify(result.accounts);

                if(accounts) {
                    localStorage.setItem('accounts', accounts);
                    commit('setAccounts', accounts);
                }
            }).catch(error => {
                console.log(error);
            });
        },

        setSelectedAccount({ commit }, account) {
            localStorage.setItem('selected_account', account);
            commit('setSelectedAccount', account);
        }
    },

    getters: {
        getAccounts: state => JSON.parse(state.accounts),
        getActiveAccounts: (state, getters) => getters.getAccounts.filter(account => {
            return !account.closed;
        }),
        getSelectedAccount: (state, getters) => getters.getActiveAccounts.find(account => {
            return account.id === state.selected_account;
        }) ?? getters.getActiveAccounts[0],
    }
};

export default accounts;


