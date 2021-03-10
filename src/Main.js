import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import App from './App';
import './App.scss';
import { API_WS_ROOT } from './constants';
import { ActionCableProvider } from 'react-actioncable-provider';
import actioncable from 'actioncable'

const cable = actioncable.createConsumer(API_WS_ROOT)

class Main extends Component {  
   

    render() {
        return(
          <div className='black-back purple-border' >  
             <App /> 
          </div>
      ) }

}

export default Main