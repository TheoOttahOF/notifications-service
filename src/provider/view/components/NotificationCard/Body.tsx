import * as React from 'react';

import './Body.scss';

interface Props {
    text?: string;
}

export function Body(props: Props) {
    const {text = ''} = props;
    return (
        <div className="text">{text}</div>
    );
}
