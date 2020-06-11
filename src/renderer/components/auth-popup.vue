<template>
    <div class="auth-popup">
        <div class="box">
            <span>Authentication required</span>

            <p>Please press <strong>allow access to your data</strong> in the Monzo app and press the button below when complete.</p>

            <div class="buttons">
                <button class="button primary" @click.prevent="setLoggedIn">Done</button>
                <button class="button" @click.prevent="goToLogin">Back to login</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            async getAccounts() {
                return this.$store.dispatch('getAccounts').then(results => {
                    return results.accounts ?? [];
                });
            },

            async getBalances(accountId) {
                return this.$store.dispatch('getBalance', accountId);
            },

            async getAllTransactions(accountId) {
                return this.$store.dispatch('getAllTransactions', accountId).then(results => {
                    return results.transactions ?? null;
                });
            },

            async setLoggedIn() {
                const $store = this.$store;
                const accounts = await this.getAccounts();

                let success = false;

                Promise.all(accounts.map(async account => {
                    await this.getBalances(account.id);
                    await this.getAllTransactions(account.id).then(transactions => {
                        if(transactions) {
                            success = true;
                        }
                    });
                })).then(() => {
                    if(success) {
                        $store.commit('setLoggedIn', true);

                        const activePersonalAccount = accounts.slice().find(account => !account.closed && account.type == 'uk_retail');

                        if(activePersonalAccount) {
                            $store.dispatch('addFeedItem', {
                                accountId: activePersonalAccount.id,
                                data: {
                                    title: 'Welcome to Monzo Desktop',
                                    image_url: 'https://i.pinimg.com/600x315/d8/b7/d6/d8b7d60c41fec4c1e3d5b0b9facc2b4e.jpg',
                                    body: 'You are now set up to use Monzo Desktop'
                                }
                            });
                        }
                    } else {
                        alert('Please try again');
                    }
                });
            },

            goToLogin() {
                this.$store.dispatch('logout');
            }
        }
    }
</script>
