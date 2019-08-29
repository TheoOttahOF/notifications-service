import {injectable, inject} from 'inversify';

import {Store} from '../store/Store';
import {RootAction, Action} from '../store/Actions';
import {Database, CollectionMap} from '../model/database/Database';
import {Inject} from '../common/Injectables';

@injectable()
export class DatabaseMiddleware {
    private _store!: Store;
    private _database!: Database;

    constructor(@inject(Inject.DATABASE) database: Database, @inject(Inject.STORE) store: Store) {
        this._store = store;
        this._database = database;
        this._store.onAction.add(this.onAction, this);
    }

    private async onAction(action: RootAction): Promise<void> {
        if (action.type === Action.CREATE) {
            const {notification} = action;

            this._database.get(CollectionMap.NOTIFICATIONS).upsert(notification);
        }
        if (action.type === Action.REMOVE) {
            const {notifications} = action;
            const ids = notifications.map(note => note.id);
            this._database.get(CollectionMap.NOTIFICATIONS).delete(ids);
        }
    }
}
