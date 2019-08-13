import * as React from 'react';

import {NotificationTime} from '../NotificationTime/NotificationTime';
import {Button} from '../Controls/Button/Button';
import {StoredNotification} from '../../../model/StoredNotification';
import {CloseButton} from '../CloseButton/CloseButton';
import {CircleButton} from '../CircleButton/CircleButton';
import {Action} from '../../../store/Actions';
import {Actionable} from '../../containers/NotificationCenterApp';

import {Body} from './Body';
import {Loading} from './Loading';

import './NotificationCard.scss';

interface Props extends Actionable {
    notification: StoredNotification;
    isToast?: boolean;
}

NotificationCard.defaultProps = {
    isToast: false
};

export function NotificationCard(props: Props) {
    const {notification, dispatch, isToast} = props;
    const data = notification.notification;
    const [loading, setLoading] = React.useState(false);

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
        <div
            className={`notification-card no-select ${isToast ? 'toast' : ''} ${loading ? 'loading' : ''}`}
            onClick={handleNotificationClick}
        >
            <div className="header">
                <div className="app-icon" style={{backgroundImage: data.icon}}></div>
                <div className="app-name single-line">{notification.source.name}</div>
                <div className="time-close">
                    <NotificationTime date={data.date} />
                    <div className="actions">
                        <CircleButton type='close' onClick={handleNotificationClose} />
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="title single-line">This is the title text</div>
                <div className="body no-select">
                    <Body text={data.body} />
                </div>
            </div>
            {data.buttons.length > 0 &&
                <div className="buttons">
                    {data.buttons.map((btn, i) => {
                        return (
                            <Button
                                key={i} text={btn.title}
                                onClick={() => {
                                    handleButtonClick(i);
                                }}
                                icon={btn.iconUrl}
                            />
                        );
                    })}
                </div>
            }
            {loading && <Loading />}
        </div>
    );
}
