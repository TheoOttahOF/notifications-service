import React from 'react';
// import {CSSTransition} from 'react-transition-group';

import {CircleButton} from '../CircleButton/CircleButton';
import './ClearAllPrompt.scss';

const duration = 300;

interface Props {
    visible: boolean;
    onChoice: (choice: boolean) => void;
}

export function ClearAllPrompt(props: Props) {
    const {visible, onChoice} = props;

    const handleClick = (choice: boolean) => {
        onChoice(choice);
    };

    return (
        // <CSSTransition
        //     in={visible}
        //     timeout={duration}
        //     classNames="animate"
        //     unmountOnExit
        // >
        <div className="prompt">
            <CircleButton type="cancel" />
            <CircleButton type="accept" />
        </div>
        // </CSSTransition>
    );
}
