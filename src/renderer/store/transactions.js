const transactions = {
    state: {
        transactions: localStorage.getItem('transactions') ?? '[]'
    },

    actions: {
        getTransactions({ commit, getters }) {
            const access_token = getters.getAccessToken;
            const getSelectedAccount = getters.getSelectedAccount;
        }
    }
};

export default transactions;
