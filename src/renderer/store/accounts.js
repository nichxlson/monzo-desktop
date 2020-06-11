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
    },

    actions: {
        getAccounts({ commit, getters }) {
            const accessToken = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                fetch(`https://api.monzo.com/accounts`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()).then(result => {
                    const accounts = JSON.stringify(result.accounts);

                    if(accounts) {
                        commit('setAccounts', accounts);
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
            dispatch('getTransactions', accountId);
        },

        getBalance({ commit, getters }, accountId) {
            const accessToken = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                if(accountId) {
                    fetch(`https://api.monzo.com/balance?account_id=${accountId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
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

        addFeedItem({ getters }, { accountId, data }) {
            const accessToken = getters.getAccessToken;

            let stringData = `account_id=${accountId}&type=basic`;

            Object.entries(data).forEach(([key, value]) => {
                let encodedValue = encodeURIComponent(value);

                if(stringData.length) {
                    stringData += `&params[${key}]=${encodedValue}`;
                } else {
                    stringData += `params[${key}]=${encodedValue}`;
                }
            });

            return new Promise((resolve, reject) => {
                if(accountId) {
                    fetch(`https://api.monzo.com/feed`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: stringData
                    }).then(response => response.json()).then(result => {
                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    reject();
                }
            });
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


