import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './redux/reducer';
import './index.css';
import App from './App';

const APP_VERSION = '4.2.0';

ReactDOM.render(
    <Provider store={configureStore({ reducer })}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

console.log(
    `%cglencoden ❤️ version ${APP_VERSION} on ${process.env.REACT_APP_HOST_ENV || 'local'}`,
    `font-size: 1rem;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            color: white;
            background:linear-gradient(#E66465, #9198E5);`
);