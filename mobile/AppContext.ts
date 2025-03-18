import App from './App';
import Store from './store/store';
import { createContext } from 'react';

interface State {
    store: Store;
}

const store = new Store();
export const AppContext = createContext<State>({ store });