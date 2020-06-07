const auth = {
    state: {
        access_token: localStorage.getItem('access_token') ?? '',
        client_id: 'oauth2client_00009vopgO5E7Kd3suWWZ7',
        client_secret: 'mnzpub.Vh2V8yBsoZQ0Jvtgi5n4WP9f737g98cnrARKMR1tmCU6Uypvr0BZx4WS5+C/Tj8P9Xb/yBL3Bfhfw29fxJRl',
        redirect_url: 'https://monzo-desktop.alexnicholson.co.uk'
    },

    mutations: {
        setAccessToken(state, access_token) {
            state.access_token = access_token;
        }
    },

    actions: {
        getAccessToken({ commit, getters }, data) {
            const client_id = getters.getClientId;
            const client_secret = getters.getClientSecret;
            const redirect_url = getters.getRedirectUrl;
            const code = data.code;

            const formData = new FormData();

            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', client_id);
            formData.append('client_secret', client_secret);
            formData.append('redirect_uri', redirect_url);
            formData.append('code', code);

            return new Promise((resolve, reject) => {
                fetch(`https://api.monzo.com/oauth2/token`, {
                    method: 'POST',
                    body: formData
                }).then(response => response.json()).then(result => {
                    const access_token = result.access_token;

                    if (access_token) {
                        localStorage.setItem('access_token', access_token);
                        commit('setAccessToken', access_token);
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

        logout({ commit }) {
            localStorage.removeItem('access_token');
            commit('setAccessToken', '');
        }
    },

    getters: {
        getAccessToken: state => state.access_token,
        getClientId: state => state.client_id,
        getClientSecret: state => state.client_secret,
        getRedirectUrl: state => state.redirect_url,
    }
};

export default auth;
