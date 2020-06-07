<template>
    <div class="page">
        <h1>Transactions</h1>

        <div class="transactions-container" v-if="transactions">
            <div class="transaction" v-for="(transaction, index) in transactions" :key="transaction.id" :data-index="index">
                <div class="top">
                    <div class="logo" v-if="transaction.merchant">
                        <img :src="transaction.merchant.logo" alt="" v-if="transaction.merchant.logo">
                        <img :src="transaction.merchant.metadata.google_places_icon" alt="" v-else>
                    </div>
                    <div class="logo generated" v-else-if="transaction.counterparty">
                        <span>{{ getAbbreviation(transaction.counterparty.name) }}</span>
                    </div>
                    <div class="logo" v-else></div>

                    <div class="details">
                        <span class="title" v-if="transaction.merchant">{{ transaction.merchant.name }}</span>
                        <span class="title" v-else-if="transaction.counterparty">{{ transaction.counterparty.name }}</span>
                        <span class="title" v-else>{{ transaction.description }}</span>
                        <span class="notes" v-if="transaction.notes">{{ transaction.notes }}</span>
                    </div>

                    <div class="amount" v-if="!transaction.metadata.hide_amount">
                        <span>{{ convertAmount(transaction.amount) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                columns: [
                    {
                        label: 'Name',
                        field: 'name',
                    },
                    {
                        label: 'Age',
                        field: 'age',
                        type: 'number',
                    },
                    {
                        label: 'Created On',
                        field: 'createdAt',
                        type: 'date',
                        dateInputFormat: 'yyyy-MM-dd',
                        dateOutputFormat: 'MMM Do yy',
                    },
                    {
                        label: 'Percent',
                        field: 'score',
                        type: 'percentage',
                    },
                ],
                rows: [
                    { id:1, name:"John", age: 20, createdAt: '',score: 0.03343 },
                    { id:2, name:"Jane", age: 24, createdAt: '2011-10-31', score: 0.03343 },
                    { id:3, name:"Susan", age: 16, createdAt: '2011-10-30', score: 0.03343 },
                    { id:4, name:"Chris", age: 55, createdAt: '2011-10-11', score: 0.03343 },
                    { id:5, name:"Dan", age: 40, createdAt: '2011-10-21', score: 0.03343 },
                    { id:6, name:"John", age: 20, createdAt: '2011-10-31', score: 0.03343 },
                ],
            };
        },

        methods: {
            convertAmount(amount, currency) {
                return this.$helpers.convertAmount(amount, currency);
            },

            getAbbreviation(str) {
                return str.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
            }
        },

        computed: {
            selectedAccount() {
                return this.$store.getters.getSelectedAccount;
            },

            transactions() {
                return this.selectedAccount.transactions.reverse() ?? [];
            }
        },

        created() {
            const $store = this.$store;
            const selectedAccount = this.selectedAccount;

            // $store.dispatch('getTransactions', selectedAccount.id);
        }
    }
</script>
