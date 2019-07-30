import * as React from 'react';

import {NotificationGroup} from '../NotificationGroup/NotificationGroup';
import {StoredNotification} from '../../../model/StoredNotification';
import {Group, GroupingType, groupNotifications} from '../../utils/groupNotifications';

interface NotificationViewProps {
    notifications: StoredNotification[];
    groupBy?: GroupingType;
}

/**
 * Component for displaying a list of notifications.
 *
 * Notifications will be grouped according to the 'groupBy' property in the
 * component's props.
 * @param props Props
 */
export function NotificationView(props: NotificationViewProps) {
    const {notifications, groupBy = GroupingType.APPLICATION} = props;
    const [groups, setGroups] = React.useState<Map<string, Group> | null>(null);

    React.useEffect(() => {
        setGroups(groupNotifications(notifications, groupBy));
    });

    return (
        <div className="panel">
            {groups &&
                [...groups.values()].map((group: Group) => (
                    <NotificationGroup
                        key={group.key}
                        name={group.title}
                        notifications={group.notifications}
                    />
                ))
            }
        </div>
    );
}
