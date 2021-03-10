import React, {Component} from 'react';
import { ActionCableConsumer ,  ActionCableController} from 'react-actioncable-provider';
import { API_ROOT, HEADERS} from '../constants';
import Cable from './Cable';
import {Container, Button} from 'react-bootstrap'
import { connect } from "react-redux";
import {createConsumer} from 'actioncable'
import { API_WS_ROOT } from '../constants/index' 
import actioncable from 'actioncable'
import {withRouter} from 'react-router-dom'
import  store   from '../store/index'
import { onReceived, setPlayerOne, clearPlayerOne, clearPlayerTwo, toggleMulti, setInternal} from '../actions/index'
import GameContainer from '../containers/GameContainer'


const consumer = actioncable.createConsumer(API_WS_ROOT)

function mapStateToProps(state){
    return state
}

function mapDispatchToProps(dispatch) {
    return {
      setPlayerOne: player => dispatch(setPlayerOne(player)),
      clearPlayerOne: () => dispatch(clearPlayerOne()),
      clearPlayerTwo: () => dispatch(clearPlayerTwo()),
      toggleMulti: () => dispatch(toggleMulti()),
      setInternal:info =>  dispatch(setInternal(info))
    }} 

class PreMultiplayerRoom extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
       
        streamId: window.location.pathname.split('/')[2],
        score: '',
        points: '',
        gameChannel: ''
       
       
    }}

    setPlayer = () => {
        console.log(this.props.playerOne.user_id != localStorage.id, 'comparison on setplayer')
        if ( this.props.playerOne.user_id != localStorage.id ) {
        let configA =  {method: 'GET',
        headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.token}`} }
        fetch(`http://localhost:3000/multi_games/${this.state.streamId}`, configA)
            .then(res => res.json())
            .then(game =>  {
                this.props.setPlayerOne(game.players[0])
                this.makePlayerTwo()
            })
        }
    }
          
makePlayerTwo =  () => {
    console.log('made it to make player two')
    const token = localStorage.token;
    let configW = { method: 'POST',
    headers: {'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`},
    body: JSON.stringify({
        user_id: localStorage.id,
        name: `P2`, 
        multi_game_id: this.state.streamId })}  
    fetch(`http://localhost:3000/players`, configW)
    .then(this.props.setInternal('P2'))
    .then(this.state.gameChannel.send({toggleMulti: true}))
    
}

    componentDidMount = () => {
        console.log('i mounted')
        this.setupSubscription()
        this.setPlayer()
    }

    setupSubscription = () => {
       this.setState({gameChannel: consumer.subscriptions.create({channel: "MultiGamesChannel", id: this.state.streamId }, {
            received(data){
               console.log(data, 'receiving data')
               store.dispatch(onReceived(data))
           }
        })
      })
    }

    componentWillUnmount() {
        console.log('i unmounted')
        this.props.toggleMulti(false)
        const {playerOne, playerTwo } = this.props
        if (playerOne)
        if (playerOne.user_id.toString() === localStorage.id){
            console.log('pade it p1')
         fetch(`${API_ROOT}/players/${playerOne.id}`,{
             method: 'DELETE',
             headers: HEADERS
         }).then(this.props.clearPlayerOne())
         .then(fetch(`${API_ROOT}/multi_games/${this.state.streamId}`, {
             method: 'DELETE',
             headers: HEADERS
         } ) ) }
        this.props.clearPlayerOne()
        this.props.clearPlayerTwo()
        this.state.gameChannel.unsubscribe()
}

    addMultiPoints = (points) => {
        this.state.gameChannel.send({multi_score: {name: this.props.player, points: points}})
    }

   leaveRoom = () => {
       const {playerOne, playerTwo } = this.props
       if (playerOne)
       if (playerOne.user_id.toString() === localStorage.id){
           console.log('pade it p1')
        fetch(`${API_ROOT}/players/${playerOne.id}`,{
            method: 'DELETE',
            headers: HEADERS
        }) 
        .then(fetch(`${API_ROOT}/multi_games/${this.state.streamId}`, {
            method: 'DELETE',
            headers: HEADERS
        } ) )
        .then( this.props.history.push('/multi'))
    }   if (playerTwo)
        if (playerTwo.user_id.toString() === localStorage.id) {
            console.log('pade it p2')
            fetch(`${API_ROOT}/players/${playerTwo.id}`,{
                method: 'DELETE',
                headers: HEADERS
            }).then( this.props.history.push('/multi'))
        }
   }

   curWord = (word) => {
     if (this.props.playerOne.user_id.toString() === localStorage.id) {
        this.state.gameChannel.send({curWord: word })  
     }
   }

   multiTimer = (time) => {
    if (this.props.playerOne.user_id.toString() === localStorage.id) {
        this.state.gameChannel.send({time: time })  
     }
   }

   endGame = (payload) => {
    if (this.props.playerOne.user_id.toString() === localStorage.id){
        this.state.gameChannel.send({toggle_game: payload})
    }
   }

    render(){
        const {playerOne, playerTwo} = this.props
        return(
            <div>

                {this.props.multiGame === true ? 
                <div> 
                <GameContainer endGame={this.endGame} multiTimer={this.multiTimer} curWord={this.curWord} addMultiPoints={this.addMultiPoints}/>
                </div>
                :
                <Container className='app-font App'> 
                     <h3> Once another player joins the room the game will begin! </h3>
                     <Button className='button' onClick={() => this.leaveRoom()}>Leave Room</Button>
                </Container>
                }
                </div>
        )
    }
}

const MultiplayerRoom = connect(mapStateToProps, mapDispatchToProps)(PreMultiplayerRoom)

export default withRouter(MultiplayerRoom)