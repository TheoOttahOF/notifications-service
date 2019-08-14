import * as React from 'react';

import {GroupingType, Actionable} from '../../containers/NotificationCenterApp/NotificationCenterApp';
import {Action} from '../../../store/Actions';
import {CircleButton} from '../CircleButton/CircleButton';

import {ClearAllPrompt} from './ClearAllPrompt';

import './Header.scss';

interface HeaderProps extends Actionable {
    visible: boolean;
    groupBy: GroupingType;
    handleGroupBy: (groupBy: GroupingType) => void;
}

export function Header(props: HeaderProps): React.ReactElement {
    const {groupBy, visible, handleGroupBy, dispatch} = props;
    const [clearAllPromptVisible, setClearAllPromptVisible] = React.useState(false);
    const handleHideWindow = () => {
        dispatch({type: Action.TOGGLE_VISIBILITY, visible: false});
    };

    const handleClearAll = () => {
        dispatch({type: Action.REMOVE_ALL});
    };

    const toggleClearAll = () => {
        setClearAllPromptVisible(!clearAllPromptVisible);
    };

    React.useEffect(() => {
        if (!visible) {
            setClearAllPromptVisible(false);
        }
    }, [visible]);

    return (<div className="header">
        <div className="title">
            <div>
                {/* <span className="count">(13214)</span> */}
            </div>
            <CircleButton type="hide" size="large" onClick={handleHideWindow} />
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
            <span className="clear detail" onClick={toggleClearAll}>
                Clear all
            </span>
            <ClearAllPrompt visible={clearAllPromptVisible} onAccept={handleClearAll} onCancel={() => setClearAllPromptVisible(false)} />
        </div>
    </div>);
}
