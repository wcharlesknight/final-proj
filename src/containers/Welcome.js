import React, {Component} from 'react'
import {Container, Button} from "react-bootstrap"



export default class Welcome extends Component {  
    
    // when game is over we will create score and game 
    
    // newGame = () => {
    //     fetch('http://localhost:3000/games', {
    //         method: 'POST', 
    //         headers: {
    //             'Content-Type':  'application/json'
    //         }
    //     })
    // }
   

    render() {
        return(
           <Container > 
               <Button> 
                   New Game
                </Button> 
            </Container>
        )
      }
    }