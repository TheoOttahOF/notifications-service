import {StoredNotification} from '../model/StoredNotification';
import {StoredApplication} from '../model/Environment';

export type RootState = Readonly<{
    notifications: StoredNotification[];
    clients: Map<string, StoredApplication>;
    windowVisible: boolean;
}>;

export type Immutable<T> = {
    readonly [K in keyof T]:
    T[K] extends Date ? T[K] :
    T[K] extends [infer U, infer V] ? Readonly<[Immutable<U>, Immutable<V>]> :
    T[K] extends Array<infer U> ? ReadonlyArray<(U extends Object ? Immutable<U> : U)> :
    T[K] extends Object ? Immutable<T[K]> :
    Readonly<T[K]>;
};

export function mutable<T>(value: Immutable<T[]>): T[]
export function mutable<T>(value: Immutable<T>): T
export function mutable<T>(value: Immutable<T>): T {
    return value as T;
}
