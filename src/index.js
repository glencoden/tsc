import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reducer from './app/reducer';
import App from './App';
import { Harbor, requestService } from 'harbor-js';

requestService.setBaseUrl(
    process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1'
        : 'https://wolke.glencoden.de'
);

const options = {
    global: {
        contentSize: {
            width: 0.95,
            height: 1
        },
        maxContentWidth: 640,
        bg: '#e5e5e5'
    },
    theme: {
        fonts: {
            body: 'roboto, sans-serif'
        }
    },
    reducer
};

ReactDOM.render(
    <Harbor options={options}>
        <App/>
    </Harbor>,
    document.getElementById('root')
);
