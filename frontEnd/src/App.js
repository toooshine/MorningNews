import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScreenSourceByArticles from './components/ScreenSourceByArticles';
import ScreenHome from './components/ScreenHome';
import ScreenMyArticles from './components/ScreenMyArticles';
import ScreenSource from './components/ScreenSource';
import whisList from './reducers/articles';
import token from './reducers/token';
import selectedLang from './reducers/selectedLang';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import './App.css';

const store = createStore(combineReducers({ token, whisList, selectedLang }));

function App() {
  return (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route component={ScreenHome} path='/' exact />
        <Route component={ScreenSource} path='/ScreenSource' exact />
        <Route component={ScreenSourceByArticles} path='/ScreenSourceByArticles/:id' exact />
        <Route component={ScreenMyArticles} path='/ScreenMyArticles' exact />
      </Switch>
    </Router>
  </Provider>  
  );
}

export default App;
