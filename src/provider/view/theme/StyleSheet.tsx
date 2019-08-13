import * as React from 'react';

interface Props {
    source?: Document;
    target: Document;
    id?: string;
}

export function StyleSheet(props: React.PropsWithChildren<Props>): React.ReactElement {
    const {source, target, children, id} = props;
    const [ready, setReady] = React.useState(false);
    React.useEffect(() => {
        if (id) {
            const sheetText = source!.getElementById('stylesheet')!.textContent;
            const sheet = target.createElement('style');
            sheet.textContent = sheetText;
            if (sheet) {
                target.head.appendChild(sheet);
            }
        } else {
            copyStyles(source!, target);
        }
        setReady(true);
    }, []);

    return (
        <React.Fragment>
            {ready && children}
        </React.Fragment>
    );
}

StyleSheet.defaultProps = {
    source: window.document
};

export function copyStyles(source: Document, target: Document) {
    for (let i = 0; i < source.styleSheets.length; i++) {
        const css = source.styleSheets[i];
        if (!(css instanceof CSSStyleSheet)) {
            continue;
        }
        // Now TypeScript knows that your sheet is a CSS sheet
        if (css) {
            // Check if rules or href
            if (css.href) {
                const newLinkEl = target.createElement('link');
                newLinkEl.rel = 'stylesheet';
                newLinkEl.href = css.href;
                target.head.appendChild(newLinkEl);
                continue;
            }
            const rules = css.cssRules ? css.cssRules : css.rules;
            if (rules) {
                const newStyleEl = target.createElement('style');
                Array.from(rules).forEach(rule => {
                    newStyleEl.appendChild(target.createTextNode(rule.cssText));
                    target.head.appendChild(newStyleEl);
                });
            }
        }
    }
}
