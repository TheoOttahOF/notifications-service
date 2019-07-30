import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import {NotificationTime} from '../NotificationTime/NotificationTime';
import {Button} from '../Button/Button';
import {StoredNotification} from '../../../model/StoredNotification';
import {CloseButton} from '../CloseButton/CloseButton';
import {Action, RootAction} from '../../../store/Actions';
import {RootState} from '../../../store/State';

interface ComponentProps {
    notification: StoredNotification;
}

type Props = ComponentProps & ReturnType<typeof mapDispatch>;

export function Component(props: Props) {
    const {notification, onButtonClick, onClick, onClose} = props;
    const data = notification.notification;

    const handleNotificationClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
    };

    return (
        <div className="notification" data-id={notification.id} onClick={handleNotificationClick}>
            <CloseButton onClick={onClose} />
            <NotificationTime date={data.date} />
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

                {data.buttons.length > 0 &&
                    <div className="buttons">
                        {data.buttons.map((btn, i) => {
                            return (
                                <Button key={btn.title + i} onClick={onButtonClick} buttonIndex={i} text={btn.title} icon={btn.iconUrl} />
                            );
                        })}
                    </div>
                }
            </div>
        </div >
    );
}

const mapStateToProps = (state: RootState, ownProps: ComponentProps) => ({
    ...ownProps
});

const mapDispatch = (dispatch: Dispatch<RootAction>, ownProps: ComponentProps) => ({
    onButtonClick: (buttonIndex: number) => {
        dispatch({type: Action.CLICK_BUTTON, notification: ownProps.notification, buttonIndex});
    },
    onClick: () => {
        dispatch({type: Action.CLICK_NOTIFICATION, notification: ownProps.notification});
    },
    onClose: () => {
        dispatch({type: Action.REMOVE, notifications: [ownProps.notification]});
    }
});

export const NotificationCard = connect(mapStateToProps, mapDispatch)(Component);

