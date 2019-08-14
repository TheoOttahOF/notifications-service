import * as React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import {NotificationCard} from '../NotificationCard/NotificationCard';
import {StoredNotification} from '../../../model/StoredNotification';
import {Actionable} from '../../containers/NotificationCenterApp/NotificationCenterApp';
import {Action} from '../../../store/Actions';
import {CircleButton} from '../CircleButton/CircleButton';
import './NotificationGroup.scss';

interface Props extends Actionable {
    // Group name
    name: string;
    // Notifications in this group
    notifications: StoredNotification[];
}

export function NotificationGroup(props: Props) {
    const {notifications, dispatch, name} = props;

    const handleClearAll = () => {
        dispatch({type: Action.REMOVE, notifications});
    };

    return (
        <div className="group">
            <div className="title">
                <span>{name}</span>
                <CircleButton type="close" size="small" onClick={handleClearAll} />
            </div>
            <TransitionGroup className="notifications" component="ul">
                {
                    notifications.map((notification, i) => {
                        return (
                            <CSSTransition
                                key={notification.id + notification.notification.date}
                                timeout={{
                                    enter: 300,
                                    exit: 300
                                }}
                                classNames="item"
                            >
                                <li key={notification.id}>
                                    <CSSTransition
                                        timeout={500}
                                    >
                                        <NotificationCard notification={notification} dispatch={dispatch} />
                                    </CSSTransition>
                                </li>
                            </CSSTransition>
                        );
                    })
                }
            </TransitionGroup>
        </div>
    );
}
