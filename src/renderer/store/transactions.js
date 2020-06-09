const transactions = {
    state: {
        transactions: localStorage.getItem('transactions') ?? '[]'
    },

    mutations: {
        setTransactions(state, { getters, payload }) {
            const accounts = getters.getAccounts;
            const account = accounts.find(account => account.id === payload.account_id);

            let newTransactions = (account.transactions ?? []).concat(JSON.parse(payload.data));
            let newTransactionsMap = new Map();

            for(const transaction of newTransactions) {
                newTransactionsMap.set(transaction.id, transaction);
            }

            Object.assign(account, {
                transactions: [...newTransactionsMap.values()]
            });

            this.commit('setAccounts', JSON.stringify(accounts));
        }
    },

    actions: {
        getAllTransactions({ commit, getters }, accountId) {
            const accessToken = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                if(accountId) {
                    fetch(`https://api.monzo.com/transactions?account_id=${accountId}&expand[]=merchant`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(response => response.json()).then(result => {
                        const transactions = JSON.stringify(result.transactions);

                        if (transactions) {
                            const payload = {
                                account_id: accountId,
                                data: transactions,
                            };

                            commit('setTransactions', {getters, payload});
                        }

                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    })
                } else {
                    reject();
                }
            });
        },

        getTransactions({ commit, getters }, accountId) {
            const accessToken = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                if(accountId) {
                    fetch(`https://api.monzo.com/transactions?account_id=${accountId}&since=2020-06-01T00:00:00Z&expand[]=merchant`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then(response => response.json()).then(result => {
                        const transactions = JSON.stringify(result.transactions);

                        if (transactions) {
                            const payload = {
                                account_id: accountId,
                                data: transactions,
                            };

                            commit('setTransactions', {getters, payload});
                        }

                        resolve(result);
                    }).catch(error => {
                        reject(error);
                    })
                } else {
                    reject();
                }
            });
        }
    }
};

export default transactions;
