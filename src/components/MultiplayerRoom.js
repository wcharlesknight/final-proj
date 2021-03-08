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
import { onReceived, setPlayerOne, clearPlayerOne, clearPlayerTwo } from '../actions/index'
import GameContainer from '../containers/GameContainer'


const consumer = actioncable.createConsumer(API_WS_ROOT)

function mapStateToProps(state){
    return state
}

function mapDispatchToProps(dispatch) {
    return {
      setPlayerOne: player => dispatch(setPlayerOne(player)),
      clearPlayerOne: () => dispatch(clearPlayerOne()),
      clearPlayerTwo: () => dispatch(clearPlayerTwo())
    }} 

class PreMultiplayerRoom extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
       
        streamId: window.location.pathname.split('/')[2],
        score: '',
        points: '',
        gameChannel: '',
        full: true
       
    }}

    setPlayer = () => {
        let configA =  {method: 'GET',
        headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.token}`} }
        fetch(`http://localhost:3000/multi_games/${this.state.streamId}`, configA)
            .then(res => res.json())
            .then(game => { console.log(game.players[0].user_id.toString() == localStorage.id)
                if(game) { 
                    if (game.players[0].user_id.toString() != localStorage.id){
                        console.log(game, 'here')
                        // this.props.setPlayerOne(game.players[0])   
                        this.makePlayerTwo()
                    }}
                    this.props.setPlayerOne(game.players[0])   
            }) 
    }
          
makePlayerTwo =  () => {
    console.log('made it')
    const token = localStorage.token;
    let configW = { method: 'POST',
    headers: {'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`},
    body: JSON.stringify({
        user_id: localStorage.id,
        name: `P2`, 
        multi_game_id: this.state.streamId })} 
    fetch(`http://localhost:3000/players`, configW)
    .then(this.setState({
        full: true, 
       
    })
    )
}

    componentDidMount = () => {
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
        const {playerOne, playerTwo } = this.props
        this.props.clearPlayerOne()
        this.props.clearPlayerTwo()
    
            this.state.gameChannel.unsubscribe()
}

    addMultiPoints = (points) => {
        fetch(`${API_ROOT}/multi_scores`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({multi_game_id: this.state.streamId,                
                    points: points,
                    player_id: this.props.playerOne.user_id.toString() === localStorage.id ? this.props.playerOne.id : this.props.playerTwo.id,
                    player_name: this.props.playerOne.user_id.toString() === localStorage.id ? this.props.playerOne.name : this.props.playerTwo.name
          }) })
      };

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
    //    debugger 
     this.state.gameChannel.send({curWord: word })
   }

    render(){
        const {playerOne, playerTwo} = this.props
       
        return(
            <div>

                {this.state.full === true ? 
                <div> 
                <GameContainer curWord={this.curWord} addMultiPoints={this.addMultiPoints}/>
                <h1 className='opponent-score'>P1: {this.props.playerOneScore}</h1>
                <h1 className='opponent-score-2'>P2: {this.props.playerTwoScore}</h1>
                </div>
                :
                <div> 
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input type='text'></input>
                    <input type='submit'></input>
                </form>
               
                     {/* <div> score: { this.props.multiPoints}</div> */}
                     {/* <div>{playerOne.name == 'P1' ? playerOne.name  : null}</div>
                     {/* <div></div> */}
                     {/* <div>{playerTwo.name == 'P2' ? playerTwo.name : null  } </div> */}
                     {/* <div>{playerTwo.user_id ? playerTwo.user_id : null }</div> */}
                     <Button onClick={() => this.leaveRoom()}>Leave Room</Button>
                     </div>
                }
                </div>
        )
    }
}

const MultiplayerRoom = connect(mapStateToProps, mapDispatchToProps)(PreMultiplayerRoom)

export default withRouter(MultiplayerRoom)