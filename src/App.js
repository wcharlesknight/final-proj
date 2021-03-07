import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import {Route, BrowserRouter} from 'react-router-dom'
import './App.scss';
import Welcome from './containers/Welcome'
import GameContainer from './containers/GameContainer'
import MultiplayerRoom from './components/MultiplayerRoom';
import MultiGamesList from './components/MultiGamesList';



class App extends Component {  
   

    render() {
        return(
          <BrowserRouter >
            <Route exact path='/' render={() => {
              return <Login  />  }} />
            <Route exact path='/game' render={() => {
              return <GameContainer  />  }} />
            <Route exact path='/welcome' render={() => {
              return <Welcome   />  }} />
            <Route exact path='/multi/:id' render={() => {
              return <MultiplayerRoom   />  }} />
               <Route exact path='/multi' render={() => {
              return <MultiGamesList  />  }} />
        </BrowserRouter>
      ) }

}

export default App 
      