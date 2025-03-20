import { registerRootComponent } from 'expo';
import App from './App';
import { createContext } from 'react';
import Store from './store/store';

interface State {
    store: Store,
}

const store = new Store();
export const AppContext = createContext<State>({ 
    store, 
}); 

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
