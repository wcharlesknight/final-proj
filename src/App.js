import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import {Route, BrowserRouter} from 'react-router-dom'
import './App.scss';
import Welcome from './containers/Welcome'
import GameContainer from './containers/GameContainer'
import PubNub from 'pubnub';
import Swal from "sweetalert2";  
import shortid  from 'shortid';
import {PubNubProvider} from 'pubnub-react';



class App extends Component {  
  constructor(props) {  
    super(props);
    // REPLACE with your keys
    
    
    this.state = {
    
      isPlaying: false, // Set to true when 2 players are in a channel
      isRoomCreator: false,
      isDisabled: false,
    
    };

    this.lobbyChannel = null; // Lobby channel
    this.gameChannel = null; // Game channel
    this.roomId = null; // Unique id when player creates a room   
    // pubnub.init(this); // Initialize PubNub
  }  

  pubnub = () => { 
    new PubNub({
    publishKey: 'pub-c-5ad20334-5930-4ee0-9116-961fa5522951', 
    subscribeKey: "sub-c-54d6ec38-7c73-11eb-9123-deb22d7a9880"    
  })
  
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0,5);
    this.lobbyChannel = 'speedwordslobby--' + this.roomId; // Lobby channel name
  
    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true // Checks the number of people in the channel
    });
    Swal.fire({
      position: 'top',
      allowOutsideClick: false,
      title: 'Share this room ID with your friend',
      text: this.roomId,
      width: 275,
      padding: '0.7em',
      // Custom CSS to change the size of the modal
      customClass: {
          heightAuto: false,
          title: 'title-class',
          popup: 'popup-class',
          confirmButton: 'button-class'
      }
    })
    this.setState({
     
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
  
    });
  }

  onPressJoin = (e) => {
    Swal.fire({
      position: 'top',
      input: 'text',
      allowOutsideClick: false,
      inputPlaceholder: 'Enter the room id',
      showCancelButton: true,
      confirmButtonColor: 'rgb(208,33,41)',
      confirmButtonText: 'OK',
      width: 275,
      padding: '0.7em',
      customClass: {
        heightAuto: false,
        popup: 'popup-class',
        confirmButton: 'join-button-class',
        cancelButton: 'join-button-class'
      } 
    }).then((result) => {
      // Check if the user typed a value in the input field
      if(result.value){
        this.joinRoom(result.value);
      }
    })
  }

  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = 'speedwordslobby--' + this.roomId;
  }

  pubnub.hereNow({
    channels: [this.lobbyChannel], 
  }).then((response) => { 
      if(response.totalOccupancy < 2){
        this.pubnub.subscribe({
          channels: [this.lobbyChannel],
          withPresence: true
        });
        
       
        this.pubnub.publish({
          message: {
            notRoomCreator: true,
          },
          channel: this.lobbyChannel
        });
      } 
  }).catch((error) => { 
    console.log(error);
  });
 

    render() {
        return(
          <PubNubProvider client={pubnub} >
          <BrowserRouter >
            <div> 
            <div className="title">
            <p> Speed Words </p>
          </div>

      {
        !this.state.isPlaying &&
        <div className="game">
          <div className="board">
      
            <div className="button-container">
              <button 
                className="create-button "
                disabled={this.state.isDisabled}
                onClick={(e) => this.onPressCreate()}
                > Create 
              </button>
              <button 
                className="join-button"
                onClick={(e) => this.onPressJoin()}
                > Join 
              </button>
            </div>                        
          </div>
        </div>
      }

      {
        this.state.isPlaying &&
        <Route exact path='/game' render={() => {
          return <GameContainer
          isRoomCreator={this.state.isRoomCreator}
          endGame={this.endGame}
          pubnub={this.pubnub}
          gameChannel={this.gameChannel} />  }} />
      }
    </div>
            <Route exact path='/' render={() => {
              return <Login  />  }} />
            <Route exact path='/welcome' render={() => {
              return <Welcome   />  }} />
        </BrowserRouter>
        </PubNubProvider>
      ) }

}

export default App 
      