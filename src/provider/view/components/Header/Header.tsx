import * as React from 'react';

import {GroupingType} from '../../containers/NotificationCenterApp/NotificationCenterApp';
import {Actionable} from '../../../store/Actions';
import {CircleButton} from '../CircleButton/CircleButton';
import {ToggleVisibility} from '../../../store/Actions';

import {ClearAllPrompt} from './ClearAllPrompt';

import './Header.scss';

interface HeaderProps extends Actionable {
    visible: boolean;
    groupBy: GroupingType;
    handleGroupBy: (groupBy: GroupingType) => void;
    onClearAll: () => void;
}

export function Header(props: HeaderProps): React.ReactElement {
    const {groupBy, visible, handleGroupBy, onClearAll, storeDispatch} = props;
    const [clearAllPromptVisible, setClearAllPromptVisible] = React.useState(false);
    const handleHideWindow = () => {
        storeDispatch(new ToggleVisibility(false));
    };

    const handleClearAll = () => {
        onClearAll();
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
