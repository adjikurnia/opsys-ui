import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

/**
 * Tema mengikuti MANTAPS / Power Inspect: biru PLN #0046ad sebagai primary,
 * latar #f4f7fa, warna kerawanan N-1 merah, N-2 kuning, N-1-2 abu.
 */
export default createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#f4f7fa',
          surface: '#ffffff',
          'surface-light': '#f8fafc',
          primary: '#0046ad',
          'primary-darken-1': '#00368a',
          secondary: '#00529C',
          error: '#dc2626',
          warning: '#eab308',
          success: '#16a34a',
          info: '#0284c7',
          'risk-n1': '#dc2626',
          'risk-n2': '#eab308',
          'risk-n12': '#64748b',
          'kv-500': '#0047AB',
          'kv-150': '#C00000',
          'kv-70': '#E0A400',
        },
      },
    },
  },
  defaults: {
    VBtn: { style: 'text-transform: none; letter-spacing: 0;' },
    VCard: { elevation: 0 },
    VChip: { size: 'small' },
    VTextField: { variant: 'outlined', density: 'compact', hideDetails: true },
    VSelect: { variant: 'outlined', density: 'compact', hideDetails: true },
  },
})
