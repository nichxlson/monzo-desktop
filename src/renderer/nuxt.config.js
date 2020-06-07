/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
    mode: 'spa', // or 'universal'
    head: {
        title: 'Monzo Desktop'
    },
    loading: false,
    css: [
        '@/assets/scss/main.scss'
    ],
    plugins: [
        '~/plugins/vue-good-table',
        '~/plugins/helpers',
    ],
    buildModules: [],
    modules: [],
};
