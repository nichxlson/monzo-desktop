<template>
    <div class="page">
        <h1>Dashboard</h1>
        <router-link to="/other">other</router-link>

        <h2 v-if="getSelectedAccount">{{ getAccountName(getSelectedAccount) }}</h2>

        <table>

        </table>
    </div>
</template>

<script>
    import accounts from "../store/accounts";

    export default {
        methods: {
            getAccountName(account) {
                return this.$helpers.getAccountName(account);
            }
        },

        computed: {
            getAccounts() {
                return this.$store.getters.getAccounts;
            },

            getSelectedAccount() {
                return this.$store.getters.getSelectedAccount;
            }
        },

        created() {
            const $store = this.$store;

            if(!this.getAccounts.length) {
                $store.dispatch('getAccounts').then(result => {
                    const accounts = result.accounts;

                    accounts.forEach(account => {
                        $store.dispatch('getBalance', account.id);
                        $store.dispatch('getAllTransactions', account.id);
                    });
                });
            }
        }
    }
</script>
