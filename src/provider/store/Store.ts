import 'reflect-metadata';
import {Signal} from 'openfin-service-signal';

import {AsyncInit} from '../controller/AsyncInit';
import {ErrorAggregator} from '../model/Errors';

import {Immutable, RootState} from './State';

type StateKey<S> = keyof S;
type StateOf<S, T extends StateKey<S>> = T extends string ? S[T] : S;

export abstract class Action<S> {
    public async call(store: StoreAPI<S>, complete: () => Promise<void>): Promise<void> {
        await complete();
    }

    public reduce(state: S): S {
        return state;
    }

    public abstract readonly type: string;
}

export abstract class KeyedAction<S, T extends StateKey<S>> extends Action<S> {
    public readonly key: StateKey<S>;

    constructor(key: T) {
        super();
        this.key = key;
    }

    // @ts-ignore Action & KeyedAction have different reduce state type param
    public reduce(state: StateOf<S, T>): StateOf<S, T> {
        return state;
    }
}

export class Init<S> extends Action<S> {
    public readonly type = '@@INIT';
    private readonly initialState: S;

    constructor(initialState: S) {
        super();
        this.initialState = initialState;
    }

    public reduce(state: S): S {
        return this.initialState;
    }
}

type Listener<S> = (getState: () => S) => void;

export type StoreAPI<S> = Pick<Store<S>, 'dispatch' | 'state'>;

export class Store<S> extends AsyncInit {
    public readonly onAction: Signal<[Action<S>], Promise<void>, Promise<void>> = new Signal(ErrorAggregator);

    private _currentState!: S;
    private readonly _listeners: Listener<S>[] = [];

    constructor() {
        super();
    }

    public get state(): Immutable<S> {
        return this._currentState as Immutable<S>;
    }

    public dispatch = <T extends StateKey<S>>(action: Action<S> | KeyedAction<S, T>): Promise<void> => {
        // @ts-ignore Action & KeyedAction have different reduce state type param
        const next = () => this.reduceAndSignal(action);
        return action.call(this, next);
    }

    protected async init(): Promise<void> {}

    protected setState(state: S): void {
        this._currentState = state;
    }

    private reduceAndSignal(action: Action<S>): Promise<void> {
        // Emit signal last
        this.reduce(action);
        return this.onAction.emit(action);
    }

    private reduce(action: Action<S>): void {
        if (action instanceof KeyedAction) {
            // @ts-ignore KeyedState
            this._currentState = {...this._currentState, [action.key]: action.reduce(this._currentState[action.key])};
        } else {
            this._currentState = action.reduce(this._currentState);
        }
        this._listeners.forEach((listener) => listener(() => this._currentState));
    }

    // Intended to be used by react-redux only - use `state` instead
    private getState(): S {
        return this._currentState;
    }

    // Intended to be used by react-redux only - use `onAction` signal instead
    private subscribe(listener: Listener<S>) {
        this._listeners.push(listener);

        return () => {
            const index: number = this._listeners.indexOf(listener);
            if (index >= 0) {
                this._listeners.splice(index, 1);
            }
        };
    }
}