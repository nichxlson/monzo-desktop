<template>
    <div class="main-app" v-if="loggedIn">
        <sidebar />

        <main>
            <nuxt />
        </main>
    </div>
    <div class="main-app" v-else>
        <login />

        <transition name="fade2">
            <auth-popup v-if="accessToken" />
        </transition>
    </div>
</template>

<script>
    const { app } = require('electron').remote;

    import login from '@/components/login.vue';
    import sidebar from '@/components/sidebar.vue';
    import authPopup from '@/components/auth-popup.vue';

    export default {
        components: {
            login,
            sidebar,
            authPopup,
        },

        computed: {
            loggedIn() {
                return this.$store.getters.getLoggedIn;
            },

            selectedAccount() {
                return this.$store.getters.getSelectedAccount;
            },

            accessToken() {
                return this.$store.getters.getAccessToken;
            }
        },

        created() {
            // Listen for deep linking
            let $router = this.$router,
                $store = this.$store;

            app.on('open-url', function (event, data) {
                event.preventDefault();

                let actions = data.split('://');

                if(actions.length > 1) {
                    let action = actions[1].split('?')[0],
                        params = actions[1].split('?')[1] ?? '';

                    switch(action) {
                        case 'login': {
                            let allParams = [];

                            if(params) {
                                params.split('&').forEach(param => {
                                    let key = param.split('=')[0],
                                        value = param.split('=')[1] ?? '';

                                    allParams[key] = value;
                                });
                            }

                            const code = allParams['code'];
                            const state = allParams['code'];

                            if(code && state) {
                                $store.dispatch('getAccessToken', {
                                    code: code,
                                    state: state
                                });
                            }

                            break;
                        }

                        case 'transactions': {
                            $router.push('transactions');
                            break;
                        }
                    }
                }
            });

            if(this.loggedIn) {
                const selectedAccount = this.selectedAccount;

                setInterval(() => {
                    $store.dispatch('getBalance', selectedAccount.id);
                    $store.dispatch('getTransactions', selectedAccount.id);
                }, 60000);
            }
        }
    }
</script>
