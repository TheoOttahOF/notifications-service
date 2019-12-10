import {Theme} from '../ThemeConfig';

export const defaultTheme: Theme = {
    name: 'Default',
    color: {
        accent: '#fbc23c',
        background: {
            normal: '#262626',
            medium: '#343434',
            light: '#3a3a3a',
            dark: '#121212',
        },
        button: {
            normal: '#717171'
        },
        blurred: '#7b7f8b',
        foreground: '#f8f8f2',
        highlight: '#504cff',
        light: '#999999',
        selection: '#44475a',
        success: '#50fa7b',
        warning: '#ff5555'
    },
    text: {
        primary: {
            color: '#f8f8f2',
            font: 'impact'
        },
        links: {
            color: '#f1fa8c'
        }
    }
}
