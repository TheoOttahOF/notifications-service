import {action} from 'typesafe-actions';

import {StoredNotification} from '../../model/StoredNotification';

import Types from './types';

/**
 * Create & store a new notification.
 * @param notification The notification to create.
 */
export const createNotification = (notification: StoredNotification) => action(Types.CREATE, {...notification} as StoredNotification);

/**
 * Remove notifications.
 * @param notifications List of notifications to remove.
 */
export const removeNotifications = (...notifications: StoredNotification[]) => action(Types.REMOVE, {notifications});

/**
 * A notification was clicked.
 * @param notification The notification that was clicked.
 */
export const clickNotification = (notification: StoredNotification) => action(Types.CLICK_NOTIFICATION, notification);

/**
 * A notification's button was clicked.
 * @param notification The notification that owns the button clicked.
 * @param buttonIndex The index of the clicked button.
 */
export const clickNotificationButton = (notification: StoredNotification, buttonIndex: number) => action(Types.CLICK_BUTTON, {notification, buttonIndex});

/** ASYNC THUNK ACTIONS */

// export function createNotification(payload: StoredNotification, sender: ProviderIdentity) {
//     return async function (dispatch: Dispatch, getState: () => RootState): Promise<Notification> {
//         // If id is not given, generate 1 and pass it back to the caller
//         payload.id = payload.id || generateId();
//         dispatch(storeNotification(payload, sender));
//         const newNotification = getNotifications(getState()).get(payload.id)!;
//         return newNotification.notification;
//     };
// }
