import * as React from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

import {NotificationGroup} from '../NotificationGroup/NotificationGroup';
import {GroupingType, Group, groupNotifications} from '../../utils/Grouping';
import {Actionable} from '../../../store/Actions';
import {StoredNotification} from '../../../model/StoredNotification';

import './NotificationView.scss';

interface NotificationViewProps extends Actionable {
    notifications: StoredNotification[];
    groupBy: GroupingType;
}

/**
 * Component for displaying a list of notifications.
 *
 * Notifications will be grouped according to the 'groupBy' property in the
 * component's props. The grouping is managed entirely within the component -
 * the only input is a flat list of all notifications.
 * @param props Props
 */
export function NotificationView(props: NotificationViewProps) {
    const {notifications, groupBy, ...rest} = props;
    // TODO: Use useEffect hook
    // Sort the notification by groups
    const groups: Map<string, Group> = groupNotifications(notifications, groupBy);

    return (
        <TransitionGroup className="view" component="div">
            {
                [...groups.values()].map((group: Group) => (
                    <CSSTransition
                        key={group.key}
                        timeout={300}
                        classNames="group-item"
                    >
                        <NotificationGroup
                            key={group.key}
                            name={group.title}
                            notifications={group.notifications}
                            {...rest}
                        />
                    </CSSTransition>
                ))
            }
        </TransitionGroup>
    );
}
