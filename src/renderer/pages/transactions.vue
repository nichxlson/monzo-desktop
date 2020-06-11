<template>
    <div class="page no-padding">
        <div class="transactions-container" v-if="transactions.length">
            <div class="transactions-filters">
                Filters here

                <ul>
                    <li>search</li>
                    <li>from/to dates</li>
                    <li>by category</li>
                    <li>by owner ({{ ownerNames.join(', ') }})</li>
                    <li>amount slider?</li>
                </ul>
            </div>

            <div class="transactions-list">
                <vue-good-table :columns="columns" :rows="transactions" :pagination-options="pagination_options" :group-options="grouped_options">
                    <template slot="table-header-row" slot-scope="props">
                        <div class="row-details">
                            <span class="date" :title="props.row.date">{{ props.row.label }}</span>
                            <span class="total" v-if="props.row.total > 0">+{{ props.row.total_converted }}</span>
                            <span class="total" v-else>{{ props.row.total_converted }}</span>
                        </div>
                    </template>

                    <template slot="table-row" slot-scope="props">
                        <div class="row-info" v-if="props.column.field == 'info'">
                            <div class="logo" v-if="props.row.merchant">
                                <div class="user" v-if="props.row.owner"><span>{{ props.row.owner.abbreviated }}</span></div>
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
                                <div class="other-text">
<!--                                    <span class="tag person" v-if="props.row.owner">{{ props.row.owner.preferred_name }}</span>-->
                                    <span class="tag" :class="props.row.category" v-if="props.row.category_formatted">{{ props.row.category_formatted }}</span>
                                    <span v-if="props.row.notes">{{ props.row.notes }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="right" :class="{ 'positive': props.row.amount > 0, 'neutral': props.row.amount == 0, 'negative': props.row.amount < 0 }" v-else-if="props.column.field == 'amount'">
                            <span class="amount" v-if="props.row.amount > 0">+{{ props.row.amount_converted }}</span>
                            <span class="amount" v-else>{{ props.row.amount_converted }}</span>
                            <span class="time">{{ props.row.created_formatted }}</span>
                        </div>
                        <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                    </template>
                </vue-good-table>
            </div>
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
                const transactions = this.selectedAccount.transactions.filter(transaction => !transaction.decline_reason && transaction.amount !== 0).slice().reverse() ?? [];
                const $helpers = this.$helpers;

                const groups = transactions.reduce((groups, transaction) => {
                    const date = transaction.created.split('T')[0];

                    if(!groups[date]) {
                        groups[date] = [];
                    }

                    if(transaction.counterparty.name) {
                        transaction.counterparty.abbreviation = transaction.counterparty.name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
                    }

                    transaction.owner = this.owners[transaction.user_id];
                    transaction.amount_converted = $helpers.convertAmount(transaction.amount, transaction.currency);
                    transaction.category_formatted = transaction.category.replace('_', ' ');

                    transaction.created_formatted = moment(transaction.created).format('h:mm A');

                    groups[date].push(transaction);

                    return groups;
                }, {});

                const groupArrays = Object.keys(groups).map(date => {
                    const groupTransactions = groups[date];

                    let total = groupTransactions.reduce((total, transaction) => total + transaction.amount, 0)

                    let now = new Date();
                    let formattedDate = moment(date).format('dddd, Do MMMM');

                    if(moment(date).diff(now, 'days') >= 0) {
                        formattedDate = 'Today';
                    }

                    if(moment(date).year() !== moment(now).year()) {
                        formattedDate = moment(date).format('dddd, Do MMMM YYYY');
                    }

                    return {
                        mode: 'span',
                        date: moment(date).format('DD/MM/YY'),
                        label: formattedDate,
                        total: total,
                        total_converted: this.convertAmount(total),
                        html: false,
                        children: groupTransactions
                    };
                });

                return groupArrays;
            },

            owners() {
                return this.selectedAccount.owners.reduce((accounts, account) => {
                    account.abbreviated = account.preferred_name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
                    accounts[account.user_id] = account;
                    return accounts;
                }, {});
            },

            ownerNames() {
                return Object.values(this.owners).map(owner => owner.preferred_name);
            }
        },

        created() {
            const $store = this.$store;
            const selectedAccount = this.selectedAccount;

            // $store.dispatch('getTransactions', selectedAccount.id);
        }
    }
</script>
