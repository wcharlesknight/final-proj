import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import {Route, BrowserRouter} from 'react-router-dom'
import './App.scss';
import Welcome from './containers/Welcome'
import GameContainer from './containers/GameContainer'
import PubNubReact from 'pubnub-react';
import Swal from "sweetalert2";  
import shortid  from 'shortid';



class App extends Component {  
  constructor(props) {  
    super(props);
    // REPLACE with your keys
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-5ad20334-5930-4ee0-9116-961fa5522951', 
      subscribeKey: "sub-c-54d6ec38-7c73-11eb-9123-deb22d7a9880"    
    });
    
    this.state = {
    
      isPlaying: false, // Set to true when 2 players are in a channel
      isRoomCreator: false,
      isDisabled: false,
    
    };

    this.lobbyChannel = null; // Lobby channel
    this.gameChannel = null; // Game channel
    this.roomId = null; // Unique id when player creates a room   
    this.pubnub.init(this); // Initialize PubNub
  }  

    render() {
        return(
      
          <BrowserRouter >
            <Route exact path='/' render={() => {
              return <Login  />  }} />
            <Route exact path='/game' render={() => {
              return <GameContainer  />  }} />
            <Route exact path='/welcome' render={() => {
              return <Welcome   />  }} />
        </BrowserRouter>
      ) }

}

export default App 
      