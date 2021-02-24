import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route} from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import Welcome from './containers/Welcome'
import GameContainer from './containers/GameContainer'
import MainContainer from './containers/MainContainer'
import store from './store/index'


ReactDOM.render(
  <Provider store={store} > 
    <BrowserRouter >
      <Route exact path='/home' component={MainContainer} /> 
      <Route path='/game' component={GameContainer} /> 
      <Route path='/welcome' component={Welcome} /> 
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
