import {Theme, ThemeConfig} from './ThemeConfig';

export type ParseFunc<T> = (key: string, value: string | number, prefix: string) => T;

/**
 * Util for generating CSS properties based on the given config.
 * @param theme 
 * @param wrap 
 */
export function generateCSSProperties(theme: Theme, wrap = false): string[] {
    let props = parseThemeConfig(theme, (key, value, prefix) => `${createPropertyName(key, prefix)}: ${value};`);
    if (wrap) {
        props = [':root {', ...props, '}'];
    }
    return props;
}

export function createPropertyName(key: string, prefix: string): string {
    return prefix === '--' ? prefix + key : prefix + '-' + key;
}

/**
 * Parse a theme config and apply a function to each rule returning an array of the results.
 * @param config 
 * @param fn 
 * @param prefix
 */
export function parseThemeConfig<T = void>(config: ThemeConfig, fn: ParseFunc<T>, prefix: string = '--'): T[] {
    return Object.entries(config).reduce((accum: T[], [key, value]) => {
        let current: T[] = [];
        if (typeof value === 'string' || typeof value === 'number') {
            current = [fn(key, value, prefix)];
        }
        else if (config[key] && !(config[key] instanceof Array)) {
            current = parseThemeConfig(config[key] as ThemeConfig, fn, createPropertyName(key, prefix));
        }
        return [...accum, ...current];
    }, []);
}