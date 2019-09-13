import {Action, Store} from './Store';
import {RootState} from './State';

export function createActionTimer<S, A extends Action<S>>(store: Store<S, A>) {
    return (action: Action<RootState>) => {
        const initTime = performance.now();
        (() => {
            const f = () => {
                store.onPostAction.remove(f);
                const currentTime = performance.now();
                console.log(`Action ${action.constructor.name} took:`, currentTime - initTime);
            };
            store.onPostAction.add(f);
        })();
    };
}

export async function getCallStack<S>(action: Action<S>) {
    const stack = [];
    let current = arguments.callee.caller;
    console.log(action.constructor.name, arguments);
    while (current.constructor instanceof Action) {
        console.log(action.constructor.name, current);
        stack.push(current);
        current = current.caller;
    }

    console.log(stack);
}

