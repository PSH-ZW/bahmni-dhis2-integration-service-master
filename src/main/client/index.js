import React from 'react';
import { render } from 'react-dom';
import reduxThunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './Reducers';
import { routes } from './Routers';
import 'babel-polyfill';

const store = createStore(reducers, applyMiddleware(reduxThunk));

render((
  <Provider store={store}>
    {routes()}
  </Provider>
), document.getElementById('app'));
