const auth = {
    state: {
        access_token: localStorage.getItem('access_token') ?? '',
        logged_in: localStorage.getItem('logged_in') ?? false,
        client_id: 'oauth2client_00009vopgO5E7Kd3suWWZ7',
        client_secret: 'mnzpub.Vh2V8yBsoZQ0Jvtgi5n4WP9f737g98cnrARKMR1tmCU6Uypvr0BZx4WS5+C/Tj8P9Xb/yBL3Bfhfw29fxJRl',
        redirect_url: 'https://monzo-desktop.alexnicholson.co.uk'
    },

    mutations: {
        setAccessToken(state, value) {
            localStorage.setItem('access_token', value);
            state.access_token = value;
        },

        setLoggedIn(state, value) {
            localStorage.setItem('logged_in', value);
            state.logged_in = value;
        }
    },

    actions: {
        setLoggedIn({ commit }, value) {
            commit('setLoggedIn', value);
        },

        getAccessToken({ commit, getters }, data) {
            const clientId = getters.getClientId;
            const clientSecret = getters.getClientSecret;
            const redirectUrl = getters.getRedirectUrl;
            const code = data.code;

            const formData = new FormData();

            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', clientId);
            formData.append('client_secret', clientSecret);
            formData.append('redirect_uri', redirectUrl);
            formData.append('code', code);

            return new Promise((resolve, reject) => {
                fetch(`https://api.monzo.com/oauth2/token`, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json()).then(result => {
                    const accessToken = result.access_token;

                    if (accessToken) {
                        localStorage.setItem('access_token', accessToken);
                        commit('setAccessToken', accessToken);
                    }

                    if (result.error) {
                        alert(result.error_description);
                    }

                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        logout({ commit, getters }) {
            const accessToken = getters.getAccessToken;

            return new Promise((resolve, reject) => {
                fetch(`https://api.monzo.com/oauth2/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(response => response.json()).then(result => {
                    commit('setAccessToken', '');
                    commit('setLoggedIn', '');

                    resolve(result);
                }).catch(error => {
                    reject(error);
                })
            });
        }
    },

    getters: {
        getAccessToken: state => state.access_token,
        getLoggedIn: state => state.logged_in,
        getClientId: state => state.client_id,
        getClientSecret: state => state.client_secret,
        getRedirectUrl: state => state.redirect_url,
    }
};

export default auth;
