import * as React from 'react';

import {GroupingType, Actionable} from '../../containers/NotificationCenterApp/NotificationCenterApp';
import {Action} from '../../../store/Actions';
import {CircleButton} from '../CircleButton/CircleButton';

// import {ClearAllPrompt} from './ClearAllPrompt';
import './Header.scss';

interface HeaderProps extends Actionable {
    groupBy: GroupingType;
    handleGroupBy: (groupBy: GroupingType) => void;
}

export function Header(props: HeaderProps): React.ReactElement {
    const {groupBy, handleGroupBy, dispatch} = props;

    const handleHideWindow = () => {
        dispatch({type: Action.TOGGLE_VISIBILITY, visible: false});
    };

    return (<div className="header">
        <div className="title">
            <div>
                {/* <span className="count">(13214)</span> */}
            </div>
            <CircleButton type="hide" size="large" />
        </div>
        <div className="strip">
            <ul className="options">
                <li className="detail">
                    <span>Sort By:</span>
                </li>
                {
                    Object.values(GroupingType).map((name, i) => {
                        const selected = name === groupBy ? 'active' : null;
                        return (
                            <li
                                key={i}
                                className={`sort-button ${selected}`}
                                onClick={() => handleGroupBy(name)}
                            >
                                <span>{name}</span>
                            </li>
                        );
                    })
                }
            </ul>
            <span className="clear detail" onClick={handleHideWindow}>
                Clear all
            </span>
            {/* <ClearAllPrompt visible={confirmVisible} onChoice={handleClearAllChoice} /> */}
        </div>
    </div>);
}
