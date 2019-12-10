// TODO: Strongly type theme config and filter out undefined properties [SERVICE-833]
export interface ThemeConfig {
    [key: string]: string | number | ThemeConfig | undefined;
}

export interface Theme extends ThemeConfig {
    id?: string;
    name: string;
    logo?: Logo;
    color: Partial<Color>;
    text: Text;
}

interface TextProperties extends ThemeConfig {
    color?: string;
    font: string;
}

interface Text extends ThemeConfig {
    primary: TextProperties;
}

interface BackgroundColors extends ThemeConfig {
    normal: string;
    light: string;
    dark: string;
}

interface Logo extends ThemeConfig {
    image: string;
    color: string;
}

interface Color extends ThemeConfig {
    foreground: string;
    blurred: string;
    background: BackgroundColors;
    dark: string;
    light: string;
    accent: string;
    selection: string;
    highlight: string;
    success: string;
    warning: string;
}
