import React, {Component} from 'react';
import { ActionCableConsumer ,  ActionCableController} from 'react-actioncable-provider';
import { API_ROOT, HEADERS} from '../constants';

import Cable from './Cable';
import {Container} from 'react-bootstrap'
import { connect } from "react-redux";
import {createConsumer} from 'actioncable'
import { API_WS_ROOT } from '../constants/index' 
import actioncable from 'actioncable'
import createReactClass from 'create-react-class'

const consumer = actioncable.createConsumer(API_WS_ROOT)

function mapStateToProps(state){
    return state
}

var onReceived = (data) => {
    console.log(data)
}


class PreMultiplayerRoom extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
        playerOne: {},
        playerTwo: {},
        streamId: window.location.pathname.split('/')[2],
        score: '',
        points: '',
        onReceived: ''
    }
   

    }
    setPlayer = () => {
        console.log(onReceived)
        let configA =  {method: 'GET',
        headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.token}`} }
        fetch(`http://localhost:3000/multi_games/${this.state.streamId}`, configA)
            .then(res => res.json())
            .then(game => {
                if (game){
                    this.makePlayerTwo()
                }
                else {
                    this.makePlayerOne()
                }
            })
    }
      
        makePlayerOne = () => {
            // console.log(onReceived)
            const token = localStorage.token;
            let configE = { method: 'POST',
            headers: {'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`},
        body: JSON.stringify({
        user_id: localStorage.id,
        name: `P1`, 
        multi_game_id: this.state.streamId})} 
    fetch(`http://localhost:3000/players`, configE)
    //   .then(
    //       onReceived ? this.setState({playerOne: onReceived.player}) :
 
    //       this.setState({playerOne:  })
        }
    //     }
            
makePlayerTwo =  () => {
    const token = localStorage.token;
    let configW = { method: 'POST',
    headers: {'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`},
    body: JSON.stringify({
        user_id: localStorage.id,
        name: `P2`, 
        multi_game_id: this.state.streamId })} 

    fetch(`http://localhost:3000/players`, configW)
    .then(
        onReceived ? console.log(onReceived) : null)
}
    handleChange = (data) => {
        console.log(data)
      }

    componentDidMount = () => {
        this.setupSubscription()
        this.setPlayer()
    }

    setupSubscription = () => {
       this.setState({gameChannel: consumer.subscriptions.create({channel: "MultiGamesChannel", id: this.state.streamId }, {
            received(data){
               PreMultiplayerRoom.handleChange(data)
            }}
       )})
        }
    
    
    componentWillUnmount() {
        this.state.gameChannel.unsubscribe()
    }

    handleReceived = (score) => {
        console.log(score)
       
        // this.setState({
        //         score: score.multi_score.points,
        //     })
    }    

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ points: e.target.children[0].value
                     });
        fetch(`${API_ROOT}/multi_scores`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({multi_game_id: this.state.streamId,                
                    points: e.target.children[0].value
        })  }).then(
        onReceived ? this.setState({score:  onReceived.multi_score.points}) : this.setState({score:  e.target.children[0].value})
        )
      };

   
    render(){
        const {playerOne, playerTwo} = this.state 
       
        return(
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input type='text'></input>
                    <input type='submit'></input>
                </form>
                {/* <ActionCableController channel={{channel: "MultiGamesChannel", id: this.state.streamId}} onReceived={this.handleReceived} />  */}
                     <div> score: {this.state.score}</div>
                     <div>{playerOne.name}</div>
                     <div>{playerOne.user_id}</div>
                     <div>{playerTwo.name}</div>
                     <div>{playerTwo.user_id}</div>
                </div>
        )
    }
}

const MultiplayerRoom = connect(mapStateToProps)(PreMultiplayerRoom)

export default MultiplayerRoom 