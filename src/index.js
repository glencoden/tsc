import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './redux/reducer';
import './index.css';
import App from './App';

ReactDOM.render(
    <Provider store={configureStore({ reducer })}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
