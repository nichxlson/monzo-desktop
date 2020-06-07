const accounts = {
    state: {
        accounts: localStorage.getItem('accounts') ?? '[]',
        selected_account: localStorage.getItem('selected_account') ?? ''
    },

    mutations: {
        setAccounts(state, accounts) {
            localStorage.setItem('accounts', accounts);
            state.accounts = accounts;
        },

        setSelectedAccount(state, account) {
            localStorage.setItem('selected_account', account);
            state.selected_account = account;
        },

        setBalance(state, payload) {
            const accounts = JSON.parse(state.accounts);
            const account = accounts.find(account => account.id === payload.account_id);

            Object.assign(account, {
                balance: payload.data
            });

            this.commit('setAccounts', JSON.stringify(accounts));
        }
    }
    ,

    actions: {
        getAccounts({ commit, getters }) {
            const access_token = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                fetch(`https://api.monzo.com/accounts`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }).then(response => response.json()).then(result => {
                    const accounts = JSON.stringify(result.accounts);

                    if(accounts) {
                        commit('setAccounts', accounts);
                    }

                    if(result.code && result.code === 'forbidden.insufficient_permissions') {
                        alert('Please allow access to your data on the Monzo app');
                    }

                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        setSelectedAccount({ commit, dispatch }, accountId) {
            commit('setSelectedAccount', accountId);
            dispatch('getBalance', accountId);
        },

        getBalance({ commit, getters }, accountId) {
            const access_token = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                if(accountId) {
                    fetch(`https://api.monzo.com/balance?account_id=${accountId}`, {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        },
                        // body: formData
                    }).then(response => response.json()).then(result => {
                        if(!result.error) {
                            commit('setBalance', {
                                account_id: accountId,
                                data: result
                            });
                        }

                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    reject();
                }
            });
        },
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


