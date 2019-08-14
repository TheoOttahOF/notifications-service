import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';

import {StoredNotification} from '../../../model/StoredNotification';
import {NotificationCard} from '../../components/NotificationCard/NotificationCard';
import {WindowDimensions} from '../../../controller/Layouter';
import {RootState} from '../../../store/State';
import {Store} from '../../../store/Store';
import {Actionable} from '../NotificationCenterApp/NotificationCenterApp';
import '../../styles/base.scss';
import './ToastApp.scss';

interface ToastAppProps extends Actionable {
    notification: StoredNotification;
    setWindowSize: (dimensions: WindowDimensions) => void;
}

type Props = ToastAppProps & ReturnType<typeof mapStateToProps>;

export function ToastApp(props: Props) {
    const {notification, setWindowSize, dispatch} = props;
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Get the size of the container ref
    const updateWindowDimensions = () => {
        if (containerRef && containerRef.current) {
            const {width, height} = containerRef.current.getBoundingClientRect();
            if (width && height) {
                setWindowSize({width, height});
            }
        }
    };

    React.useEffect(() => {
        if (containerRef.current === null) {
            return;
        }
        updateWindowDimensions();
    });

    return (
        <div id='toast-container' ref={containerRef}>
            <NotificationCard notification={notification} dispatch={dispatch} />
        </div>
    );
}

const mapStateToProps = (state: RootState, ownProps: ToastAppProps) => ({
    ...ownProps
});

const Container = connect(mapStateToProps)(ToastApp);

export function renderApp(notification: StoredNotification, document: Document, store: Store, setWindowSize: (dim: WindowDimensions) => void) {
    ReactDOM.render(
        <Provider store={store['_store']}>
            <Container dispatch={store.dispatch} notification={notification} setWindowSize={setWindowSize} />
        </Provider>,
        document.getElementById('react-app')
    );
}