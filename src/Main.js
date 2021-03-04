import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import App from './App';
import './App.scss';

import { ActionCableProvider } from 'react-actioncable-provider';



class Main extends Component {  
   

    render() {
        return(
    <ActionCableProvider url={API_WS_ROOT}>
         <App/> 
    </ActionCableProvider>
      ) }

}

export default Main