import * as React from 'react';
import {Theme} from './ThemeConfig';
import {parseThemeConfig, createPropertyName} from './utils';

export interface ThemeContext {
    theme: Theme;
    setTheme: (theme: Theme) => void; 
}

// The default context used for theme providers if none is set.
export const DefaultThemeContext: React.Context<ThemeContext> = React.createContext({
    theme: {} as Theme,
    setTheme: (theme: Theme) => {}
});

export interface Theming {
    // Unique context for this theme to access it anywhere in the tree.
    context: React.Context<ThemeContext>;
    // Hook to get the theme being used by a component.
    useTheme: () => ThemeContext;
    // ThemeProvider connected with a context, useTheme & updateTheme.
    ThemeProvider: React.FC<ThemeProviderProps>;
}

export function createTheming(theme: Theme, updateBody: boolean = false, customContext?: React.Context<ThemeContext>): Theming {
    const context = customContext || DefaultThemeContext;
    const ref = React.createRef<HTMLDivElement>();
    const provider: React.FC<ThemeProviderProps> = (props) => ThemeProvider({...props, ref, theme, Context: context});
    const useTheme = () => React.useContext(context);

    return {
        context,
        useTheme,
        ThemeProvider: React.memo(provider)
    };
}

interface ThemeProviderProps {
    ref?: React.RefObject<HTMLDivElement>;
    updateBody?: boolean;
    theme?: Theme;
    Context?: React.Context<ThemeContext>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
    const {children, Context = DefaultThemeContext, theme = {} as Theme, updateBody = false} = props;
    const [themeState, setThemeState] = React.useState<Theme>(theme);
    const ref = props.ref || React.createRef<HTMLDivElement>();
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        if (ref.current) {
            applyTheme(ref.current, themeState);
            setReady(true);
        }
    }, [ref, themeState]);

    const value: ThemeContext = {
        theme: themeState,
        setTheme: (theme) => {
            setThemeState(theme);
            applyTheme(ref.current!, theme);
            if (theme.color.background! && updateBody) {
                document.body.style.background = theme.color.background!.normal;
            }
        }
    };

    return (
        <Context.Provider value={value}>
            <div ref={ref} style={{overflow: 'auto'}}>{ready && children}</div>
        </Context.Provider>
    )
}

/**
 * Apply a theme config to a DOM node.
 * @param node The DOM node to apply a theme's CSS custom properties to. 
 * @param theme Theme to apply.
 */
function applyTheme(node: HTMLElement, theme: Theme): void {
    console.groupCollapsed(`Applying ${theme.name}`);
    parseThemeConfig(theme, (key, value, prefix) => {
        const propertyName = createPropertyName(key, prefix)
        node.style.setProperty(propertyName, value as string);
        console.log(`${propertyName}: ${value};`);
    });
    console.groupEnd();
}
