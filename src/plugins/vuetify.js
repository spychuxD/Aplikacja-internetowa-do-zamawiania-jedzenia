import Vue from 'vue';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify);
// import { VuetifyPreset } from 'vuetify/types/services/presets'

const preset  = {
    breakpoint: {
        scrollBarWidth: 16,
        thresholds: {
            xs: 400,
            sm: 600,
            md: 800,
            lg: 1000,
        },
    },
    lang: {
        current: 'pl',
    },
    rtl: false,
    theme: {
        dark: false,
        default: 'light',
        disable: false,
        options: {
            cspNonce: undefined,
            customProperties: undefined,
            minifyTheme: undefined,
            themeCache: undefined,
        },
        themes: {
            light: {
                primary: '#E79E4F',
                secondary: '#321F28',
                accent: '#734046',
                error: '#CC0000',
                info: '#734046',
                success: '#2C632D',
                warning: '#FB8C00',
            },
            dark: {
                primary: '#321F28',
                secondary: '#E79E4F',
                accent: '#734046',
                error: '#CC0000',
                info: '#734046',
                success: '#2C632D',
                warning: '#FB8C00',
            },
        },
    },
}

export default new Vuetify({
    preset,
    theme: { dark: false }
});
