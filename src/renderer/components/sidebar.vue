<template>
    <aside class="sidebar">
        <div class="top">
            <div class="account-selector">
                <div class="select-container">
                    <select name="" id="" @change="setSelectedAccount($event)">
                        <option v-for="account in getActiveAccounts" :value="account.id" :selected="account.id === getSelectedAccount.id">{{ getAccountName(account) }}</option>
                    </select>
                </div>
            </div>

            <div class="account-details" v-if="getSelectedAccount">
                <div class="detail balance" v-if="getSelectedAccount.balance">
                    <span class="small">Balance</span>
                    <span class="large">{{ convertAmount(getSelectedAccount.balance.balance, getSelectedAccount.balance.currency) }}</span>
                </div>

                <div class="detail">
                    <span class="small">Sort code</span>
                    <span class="large copyable" @click.prevent="copyToClipboard(getSelectedAccount.sort_code)">{{ getSelectedAccount.sort_code }}</span>
                </div>

                <div class="detail">
                    <span class="small">Account number</span>
                    <span class="large copyable" @click.prevent="copyToClipboard(getSelectedAccount.account_number)">{{ getSelectedAccount.account_number }}</span>
                </div>
            </div>

            <nav>
                <router-link to="/" exact><span>Dashboard</span></router-link>
                <router-link to="/transactions"><span>Transactions</span></router-link>
                <router-link to="/pots"><span>Pots</span></router-link>
            </nav>
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
            }
        },

        computed: {
            getActiveAccounts() {
                return this.$store.getters.getActiveAccounts;
            },

            getSelectedAccount() {
                return this.$store.getters.getSelectedAccount;
            }
        },
    }
</script>
