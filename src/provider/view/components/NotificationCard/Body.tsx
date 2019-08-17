import * as React from 'react';
import markdown from 'markdown-it';

import './Body.scss';

const md = markdown('zero', {breaks: true});

md.enable('hr');
md.enable('paragraph');
md.enable('image');
md.enable('newline');
md.enable('heading');
md.enable('lheading');
md.enable('list');
md.enable('blockquote');
md.enable('emphasis');

interface Props {
    text?: string;
}

export function Body(props: Props) {
    const {text = ''} = props;
    return (
        <div className="text" dangerouslySetInnerHTML={{__html: md.render(text)}}></div>
    );
}
