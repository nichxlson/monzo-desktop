<template>
    <div class="page no-padding">
        <div class="transactions-container" v-if="transactions.length">
            <vue-good-table :columns="columns" :rows="transactions" :pagination-options="pagination_options" :group-options="grouped_options">
                <template slot="table-header-row" slot-scope="props">
                    <div class="row-details">
                        <span class="date">{{ props.row.label }}</span>
                        <span class="total">{{ props.row.total }}</span>
                    </div>
                </template>

                <template slot="table-row" slot-scope="props">
                    <div class="row-info" v-if="props.column.field == 'info'">
                        <div class="logo" v-if="props.row.merchant">
                            <img :src="props.row.merchant.logo" alt="" v-if="props.row.merchant.logo">
                            <img class="icon" :src="props.row.merchant.metadata.google_places_icon" alt="" v-else>
                        </div>
                        <div class="logo generated" v-else-if="props.row.counterparty">
                            <span>{{ props.row.counterparty.abbreviation }}</span>
                        </div>
                        <div class="logo" v-else></div>

                        <div class="details">
                            <span class="title" v-if="props.row.merchant">{{ props.row.merchant.name }}</span>
                            <span class="title" v-else-if="props.row.counterparty">{{ props.row.counterparty.name }}</span>
                            <span class="title" v-else>{{ props.row.description }}</span>
                            <span class="notes" v-if="props.row.notes">{{ props.row.notes }}</span>
                        </div>
                    </div>
                    <div class="right" :class="{ 'positive': props.row.amount > 0, 'neutral': props.row.amount == 0, 'negative': props.row.amount < 0 }" v-else-if="props.column.field == 'amount'">
                        <span class="tag" v-if="props.row.category_formatted">{{ props.row.category_formatted }}</span>
                        <span class="amount">{{ props.row.amount_converted }}</span>
                    </div>
                    <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                </template>
            </vue-good-table>
        </div>
    </div>
</template>

<script>
    const moment = require('moment');

    export default {
        data() {
            return {
                columns: [{
                    label: 'Info',
                    field: 'info',
                }, {
                    label: 'Amount',
                    field: 'amount',
                    type: 'number',
                }],
                pagination_options: {
                    enabled: false,
                    mode: 'records',
                    perPage: 5
                },
                grouped_options: {
                    enabled: true
                }
            };
        },

        methods: {
            convertAmount(amount, currency) {
                return this.$helpers.convertAmount(amount, currency);
            },

            getAbbreviation(str) {
                return str.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
            },

            transactionsTotal(transactions) {
                return transactions.reduce((total, transaction) => total + transaction.amount, 0);
            }
        },

        computed: {
            selectedAccount() {
                return this.$store.getters.getSelectedAccount;
            },

            transactions() {
                const transactions = this.selectedAccount.transactions.slice().reverse() ?? [];
                const $helpers = this.$helpers;

                const groups = transactions.reduce((groups, transaction) => {
                    const date = transaction.created.split('T')[0];

                    if(!groups[date]) {
                        groups[date] = [];
                    }

                    if(transaction.counterparty.name) {
                        transaction.counterparty.abbreviation = transaction.counterparty.name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
                    }

                    transaction.amount_converted = $helpers.convertAmount(transaction.amount, transaction.currency);
                    transaction.category_formatted = transaction.category.replace('_', ' ');

                    groups[date].push(transaction);

                    return groups;
                }, {});

                const groupArrays = Object.keys(groups).map(date => {
                    const groupTransactions = groups[date];

                    date = moment(date).format('dddd, D MMM');

                    return {
                        mode: 'span',
                        label: date,
                        total: this.convertAmount(groupTransactions.reduce((total, transaction) => total + transaction.amount, 0)),
                        html: false,
                        children: groupTransactions
                    };
                });

                return groupArrays;
            },
        },

        created() {
            const $store = this.$store;
            const selectedAccount = this.selectedAccount;

            // $store.dispatch('getTransactions', selectedAccount.id);
        }
    }
</script>
