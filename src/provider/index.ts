import {RootState, configureStore} from './store';
import {NotificationCenter} from './controller/NotificationCenter';
import {registerService} from './controller/IABService';
import {ToastManager} from './controller/ToastManager';

// Initial state is overwritten by the persisted data
const initialState: RootState = {
    notifications: {
        notifications: {}
    },
    ui: {
        windowVisible: false,
        bannerDirection: [-1, -1],
        actionDirection: [1, 1]
    }
};

// Redux store
const {store} = configureStore(initialState);

// Change to singleton?
const notificationCenter = new NotificationCenter(store, {hideOnBlur: false});

ToastManager.instance.initialize(store);
// IAB
registerService(store);



