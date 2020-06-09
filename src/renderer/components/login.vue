<template>
    <div class="login-container">
        <a @click="openUrl(loginUrl)" class="button primary">Login with your Monzo account</a>
    </div>
</template>

<script>
    const { remote } = require('electron');

    export default {
        methods: {
            openUrl(url) {
                remote.shell.openExternal(url);
            }
        },

        computed: {
            clientId() {
                return this.$store.getters.getClientId;
            },

            redirectUrl() {
                return this.$store.getters.getRedirectUrl;
            },

            loginUrl() {
                const clientId = this.clientId;
                const redirectUrl = this.redirectUrl;
                const state = Math.random().toString(36);

                return `https://auth.monzo.com/?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&state=${state}`
            }
        }
    }
</script>
