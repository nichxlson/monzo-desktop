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
        }
    }
</script>
