<template>
    <aside class="sidebar">
        <div class="account-selector">
            <select name="" id="" v-model="selected_account">
                <option v-for="account in getActiveAccounts" :value="account.id" :key="account.id">{{ getAccountName(account) }}</option>
            </select>
        </div>

        <nav>
            <a href="#">transactions</a>
            <a href="#">test</a>
        </nav>
    </aside>
</template>

<script>
    export default {
        data() {
            return {
                selected_account: ''
            }
        },

        methods: {
            getAccountName(account) {
                return this.$helpers.getAccountName(account);
            }
        },

        computed: {
            getActiveAccounts() {
                return this.$store.getters.getActiveAccounts;
            }
        },

        watch: {
            selected_account(account) {
                this.$store.dispatch('setSelectedAccount', account)
            }
        },

        created() {
            const selectedAccount = this.$store.getters.getSelectedAccount;

            if(selectedAccount) {
                this.selected_account = selectedAccount.id;
            }
        }
    }
</script>
