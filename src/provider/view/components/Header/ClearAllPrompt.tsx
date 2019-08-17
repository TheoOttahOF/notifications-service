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
    const divRef = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        if (visible)
            divRef.current!.focus();
    }, [visible]);

    return (
        <CSSTransition
            in={visible}
            timeout={200}
            classNames="animate"
            unmountOnExit
        >
            <div tabIndex={0} className="prompt" ref={divRef} onBlur={onCancel}>
                <CircleButton type="cancel" onClick={onCancel} />
                <CircleButton type="accept" onClick={onAccept} />
            </div>
        </CSSTransition>
    );
}
