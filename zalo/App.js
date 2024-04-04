import RootStackNavigator from './routers/RootStackNavigator';
import { Provider } from 'react-redux';
import store from './redux/store';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export default function App() {
    return (
        <Provider store={store}>
            <RootStackNavigator />
        </Provider>
    );
}