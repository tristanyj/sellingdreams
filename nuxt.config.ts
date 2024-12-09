// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_TITLE =
  'Selling Dreams | 100 years of advertising evolution and iconic campaigns in the United States';
const SITE_DESCRIPTION =
  'Selling Dreams is a visual history of advertising in the United States, from 1910 to 2007. Explore the most iconic campaigns and the evolution of advertising over the past 100 years.';
const SITE_URL = 'https://google.com/';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/css/transition.css'],
  colorMode: {
    preference: 'light',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: SITE_TITLE,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: SITE_DESCRIPTION,
        },
        {
          name: 'twitter:title',
          content: SITE_TITLE,
        },
        { name: 'twitter:url', content: SITE_URL },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        { name: 'twitter:image', content: '/backdrop.png' },
        { name: 'og:url', content: SITE_URL },
        { name: 'og:title', content: SITE_TITLE },
        {
          name: 'og:description',
          content: SITE_DESCRIPTION,
        },
        { name: 'og:image', content: '/backdrop.png' },
      ],
      style: [],
      script: [],
    },
  },
  imports: {
    dirs: ['stores/**'],
  },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/fonts',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'storeToRefs'],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
  ],
});
