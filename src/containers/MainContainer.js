import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Login from './Login'

import store from "../store/index";
import Welcome from './Welcome'
import GameContainer from './GameContainer'



class MainContainer extends Component {  
   

    render() {
        return(
         <Container>
           <Login  /> 
         
         </Container>
      ) }

}

export default MainContainer
      