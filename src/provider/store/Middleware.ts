import {MiddlewareAPI, Dispatch} from 'redux';

import {Action, RootAction} from './Actions';
import {RootState} from './State';
import {Store} from './Store';

export function middleware(this: Store) {
    return (api: MiddlewareAPI<Dispatch<RootAction>, RootState>) => (next: Dispatch<RootAction>) => async (action: RootAction) => {
        if (action.type === Action.CREATE) {
            if (api.getState().notifications.some(note => note.id === action.notification.id)) {
                const t = api.dispatch({type: Action.REMOVE, notifications: [action.notification]});
                console.log('Awaited ', t);

                await t;
            }
        }

        await this.onAction.emit(action);
        console.log(action.type);
        return next(action);
    };
}
