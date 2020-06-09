<template>
    <aside class="sidebar">
        <div class="top">
            <div class="account-selector">
                <div class="select-container">
                    <select name="" id="" @change="setSelectedAccount($event)">
                        <option v-for="account in activeAccounts" :value="account.id" :selected="account.id === selectedAccount.id">{{ getAccountName(account) }}</option>
                    </select>
                </div>
            </div>

            <div class="account-details" v-if="selectedAccount">
                <div class="detail balance" v-if="selectedAccount.balance">
                    <span class="small">Balance</span>
                    <span class="large">{{ convertAmount(selectedAccount.balance.balance, selectedAccount.balance.currency) }}</span>
                </div>

                <div class="detail">
                    <span class="small">Sort code</span>
                    <span class="large copyable" @click.prevent="copyToClipboard(selectedAccount.sort_code)">{{ selectedAccount.sort_code }}</span>
                </div>

                <div class="detail">
                    <span class="small">Account number</span>
                    <span class="large copyable" @click.prevent="copyToClipboard(selectedAccount.account_number)">{{ selectedAccount.account_number }}</span>
                </div>
            </div>

            <nav>
                <router-link to="/" exact><span>Dashboard</span></router-link>
                <router-link to="/transactions"><span>Transactions</span></router-link>
                <router-link to="/pots"><span>Pots</span></router-link>
            </nav>
        </div>

        <div class="bottom">
            <a href="#" @click.prevent="logout">Logout</a>
        </div>
    </aside>
</template>

<script>
    export default {
        methods: {
            getAccountName(account) {
                return this.$helpers.getAccountName(account);
            },

            convertAmount(amount, currency) {
                return this.$helpers.convertAmount(amount, currency);
            },

            setSelectedAccount(event) {
                this.$store.dispatch('setSelectedAccount', event.target.value);
            },

            copyToClipboard(text) {
                var input = document.createElement('textarea');
                input.innerHTML = text;
                document.body.appendChild(input);
                input.select();
                var result = document.execCommand('copy');
                document.body.removeChild(input);
                return result;
            },

            logout() {
                const $router = this.$router;

                this.$store.dispatch('logout').then(result => {
                    $router.replace('/');
                });
            }
        },

        computed: {
            activeAccounts() {
                return this.$store.getters.getActiveAccounts;
            },

            selectedAccount() {
                return this.$store.getters.getSelectedAccount;
            }
        },
    }
</script>
