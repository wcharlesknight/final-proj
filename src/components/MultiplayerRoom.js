import React, {Component} from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { API_ROOT, HEADERS} from '../constants';

import Cable from './Cable';
import {Container} from 'react-bootstrap'
import { connect } from "react-redux";
import {createConsumer} from 'actioncable'
import { API_WS_ROOT } from '../constants/index' 
import actioncable from 'actioncable'

const cable = actioncable.createConsumer(API_WS_ROOT)

function mapStateToProps(state){
    return state
}

class PreMultiplayerRoom extends Component{

    state = {
        playerOne: {},
        playerTwo: {},
        streamId: window.location.pathname.split('/')[2],
        score: '',
        points: ''
      
    }

    setPlayer = () => {
      
        if (this.state.playerOne === true) {
        const token = localStorage.token;
        let configW = { method: 'POST',
        headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`},
        body: JSON.stringify({
            user_id: localStorage.id,
            name: `P2`, 
            multi_game_id: this.props.multiGame.id })} 
        fetch(`http://localhost:3000/players`, configW)
            .then(res => res.json())
            .then(player => {  
                this.setState({playerTwo: player}) }) 
             } else {
                const token = localStorage.token;
                let configW = { method: 'POST',
                headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`},
            body: JSON.stringify({
            user_id: localStorage.id,
            name: `P1`, 
            multi_game_id: this.props.multiGame.id })} 
        fetch(`http://localhost:3000/players`, configW)
            .then(res => res.json())
            .then(player => {  
                this.setState({playerOne: player}) }) 
             }
    }
            
    
    handleChange = (e) => {
        // debugger 
        this.setState({ points: e.target.value});
      }

    // componentDidMount = () => {
    //    console.log(window.location.pathname.split('/')[2])

    // }

    handleReceived = (score) => {
        console.log(score)
        this.setState({
                score: score.multi_score.points 
            })
    }    

    handleSubmit = (e) => {
     
        e.preventDefault();
        fetch(`${API_ROOT}/multi_scores`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({multi_game_id: this.state.streamId,                
                    points: e.target.children[0].value
        })  });
        this.setState({ points: '' });
      };

    render(){
        const {playerOne, playerTwo} = this.state 
        return(
        
               <ActionCableConsumer 
                channel={{channel: "MultiGamesChannel", id: this.state.streamId}}
                key={this.props.multiGame.id}
                onReceived={this.handleReceived}> 
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input type='text'></input>
                    <input type='submit'></input>
                </form>
                     <div> score: {this.state.score}</div>
                     <div>{playerOne.name}</div>
                     <div>{playerOne.user_id}</div>
                     <div>{playerTwo.name}</div>
                     <div>{playerTwo.user_id}</div>
                </ActionCableConsumer>
           
        )
    }
}

const MultiplayerRoom = connect(mapStateToProps)(PreMultiplayerRoom)

export default MultiplayerRoom 