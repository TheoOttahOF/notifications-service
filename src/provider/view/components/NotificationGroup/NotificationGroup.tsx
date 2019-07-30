import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import {NotificationCard} from '../NotificationCard/NotificationCard';
import {StoredNotification} from '../../../model/StoredNotification';
import {CloseButton} from '../CloseButton/CloseButton';
import {Action, RootAction} from '../../../store/Actions';

interface ComponentProps {
    // Group name
    name: string;
    // Notifications in this group
    notifications: StoredNotification[];
}

type Props = ComponentProps & ReturnType<typeof mapDispatch>;

function Component(props: Props) {
    const {notifications, clearAllNotifications} = props;

    const handleClearAll = () => {
        clearAllNotifications();
    };

    return (
        <div className="group">
            <div className="header">
                <div className="title">
                    {props.name.toUpperCase()}
                </div>
                <CloseButton onClick={handleClearAll} />
            </div>
            <ul>
                {
                    notifications.map((notification, i) => {
                        return (
                            <li key={i + notification.id}>
                                <NotificationCard notification={notification} />
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

const mapDispatch = (dispatch: Dispatch<RootAction>, ownProps: ComponentProps) => ({
    clearAllNotifications: () => {
        dispatch({type: Action.REMOVE, notifications: ownProps.notifications});
    }
});

export const NotificationGroup = connect(null, mapDispatch)(Component);

