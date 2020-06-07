<template>
    <div>
        <h1>home</h1>
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
            if(!this.getAccounts.length) {
                this.$store.dispatch('getAccounts').then(result => {
                    console.log(result);
                });
            }

            const access_token = this.$store.getters.getAccessToken;
            const getSelectedAccountId = this.getSelectedAccount.id;

            const formData = new FormData();

            formData.append('account_id', getSelectedAccountId);

            // fetch(`https://api.monzo.com/accounts/${getSelectedAccountId}/direct-debits`, {
            //     headers: {
            //         Authorization: `Bearer ${access_token}`
            //     },
            //     body: formData
            // }).then(response => response.json()).then(result => {
            //     console.log(result);
            // }).catch(error => {
            //     console.log(error);
            // });
        }
    }
</script>
