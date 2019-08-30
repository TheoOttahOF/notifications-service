import {injectable, inject} from 'inversify';
import Dexie from 'dexie';

import {StoredSetting} from '../StoredSetting';
import {StoredNotification} from '../StoredNotification';
import {AsyncInit} from '../../controller/AsyncInit';
import {Store} from '../../store/Store';
import {Inject} from '../../common/Injectables';
import {RootAction, Action} from '../../store/Actions';
import {DatabaseError} from '../../common/Errors';

import {Collection} from './Collection';

export const enum CollectionMap {
    NOTIFICATIONS = 'notifications',
    SETTINGS = 'settings'
}

export type Collections = {
    [CollectionMap.NOTIFICATIONS]: StoredNotification;
    [CollectionMap.SETTINGS]: StoredSetting;
};

@injectable()
export class Database extends AsyncInit {
    private _database: Dexie;
    private _collections: Map<CollectionMap, Collection<any>>;
    @inject(Inject.STORE)
    private _store!: Store;

    constructor() {
        super();
        this._database = new Dexie('notifications-service');
        this._collections = new Map<CollectionMap, Collection<any>>();

        this._database.version(1).stores({
            [CollectionMap.NOTIFICATIONS]: '&id',
            [CollectionMap.SETTINGS]: '&id'
        });

        this.createCollections(this._database.tables);
    }

    protected async init(): Promise<void> {
        await this._database.open();
        this._store.onAction.add(this.onAction, this);
    }

    /**
     * Returns a collection of the provided name.
     * @param collectionName The collection name.
     */
    public get<T extends keyof Collections>(collectionName: T): Collection<Collections[T]> {
        const table = this._collections.get(collectionName);

        if (table) {
            return table;
        } else {
            throw new Error(`Table with id ${collectionName} not found.`);
        }
    }

    private createCollections(tables: Dexie.Table<Collections[keyof Collections], string>[]): void {
        tables.forEach(table => {
            this._collections.set(table.name as CollectionMap, new Collection(table));
        });
    }

    private async onAction(action: RootAction): Promise<void> {
        if (action.type === Action.CREATE) {
            const {notification} = action;
            try {
                await this.get(CollectionMap.NOTIFICATIONS).upsert(notification);
            } catch (error) {
                throw new DatabaseError(`Unable to upsert ${notification.id}`, error);
            }
        }
        if (action.type === Action.REMOVE) {
            const {notifications} = action;
            const ids = notifications.map(note => note.id);
            try {
                await this.get(CollectionMap.NOTIFICATIONS).delete(ids);
            } catch (error) {
                throw new DatabaseError(`Unable to delete ${ids}`, error);
            }
        }
    }
}
