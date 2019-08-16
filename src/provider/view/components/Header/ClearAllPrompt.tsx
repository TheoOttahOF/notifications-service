import React from 'react';
import {CSSTransition} from 'react-transition-group';

import {CircleButton} from '../CircleButton/CircleButton';
import './ClearAllPrompt.scss';

interface Props {
    visible: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

export function ClearAllPrompt(props: Props) {
    const {visible, onAccept, onCancel} = props;

    return (
        <CSSTransition
            in={visible}
            timeout={200}
            classNames="animate"
            unmountOnExit
        >
            <div className="prompt">
                <CircleButton type="cancel" onClick={onCancel} />
                <CircleButton type="accept" onClick={onAccept} />
            </div>
        </CSSTransition>
    );
}
