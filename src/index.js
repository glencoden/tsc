import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reducer from './app/reducer';
import App from './App';
import { Harbor } from 'harbor-js';

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
