import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './containers/Login'
import {Route, BrowserRouter} from 'react-router-dom'
import './App.scss';
import Welcome from './containers/Welcome'
import GameContainer from './containers/GameContainer'



class App extends Component {  
   

    render() {
        return(
          <BrowserRouter >
           {/* <Route exact path="/wine" render={() => { 
        return <Wine wine={this.state.selectedWine} user={this.state.user} /> }} />  */}
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
      