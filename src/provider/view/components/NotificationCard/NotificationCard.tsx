import * as React from 'react';

import {NotificationTime} from '../NotificationTime/NotificationTime';
import {Button} from '../Controls/Button/Button';
import {StoredNotification} from '../../../model/StoredNotification';
import {CloseButton} from '../CloseButton/CloseButton';
import {Action} from '../../../store/Actions';
import {Actionable} from '../../containers/NotificationCenterApp';

import * as styles from './NotificationCard.css';

interface NotificationCardProps extends Actionable {
    notification: StoredNotification;
}

export function NotificationCard(props: NotificationCardProps) {
    const {notification, dispatch} = props;
    const data = notification.notification;
    const appIconStyle = {backgroundImage: `url(${data.icon})`};

    const handleNotificationClose = () => {
        dispatch({type: Action.REMOVE, notifications: [notification]});
    };

    const handleButtonClick = (buttonIndex: number) => {
        dispatch({type: Action.CLICK_BUTTON, notification, buttonIndex});
    };

    const handleNotificationClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch({type: Action.CLICK_NOTIFICATION, notification});
    };

    return (
        <div className="notification-card" data-id={notification.id} onClick={handleNotificationClick}>
            <div className="header">
                <div className="app-icon" style={appIconStyle}></div>
                <div className="app-name no-select">Blotter App</div>
                <div className="time-close no-select">
                    <NotificationTime date={data.date} />
                    <CloseButton onClick={handleNotificationClose} />
                </div>
            </div>
            <div className="content">
                <div className="title single-line">{data.title}</div>
                <div className="body no-select">
                    <div className="text">

                    </div>
                </div>
            </div>
            {data.buttons.length > 0 &&
                <div className="buttons">
                    {data.buttons.map((btn, i) => {
                        return (
                            <Button key={btn.title + i} onClick={handleButtonClick} buttonIndex={i} text={btn.title} icon={btn.iconUrl} />
                        );
                    })}
                </div>
            }
            <div className="body">
                <div className="source">
                    {data.icon && <img src={data.icon} />}
                    <span className="app-name">
                        {notification.source.name}
                    </span>
                </div>
                <div className="title">
                    {data.title}
                </div>
                <div className="text">
                    {data.body}
                </div>

            </div>
        </div >
    );
}
