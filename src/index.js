import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {store} from './app/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import initializeFirebase from "firebase/config";
import {ThemeProvider} from '@material-ui/core';
import theme from "app/theme";

initializeFirebase();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App/>
            </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
