import {defaultTheme} from './themes/default';
import {createTheming} from './Theme';
import {draculaTheme} from './themes/dracula';
import {generateCSSProperties} from './utils';

export const {ThemeProvider, context, useTheme} = createTheming(draculaTheme, true);

// Test themes
Object.assign(window, {
    theme: {
        context,
        generateCSSProperties,
        useTheme,
        themes: {
            draculaTheme,
            defaultTheme
        }
    }
});