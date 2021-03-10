import React from 'react';
import { API_ROOT, API_WS_ROOT, HEADERS } from '../constants';
import {withRouter} from 'react-router-dom'
import { connect } from "react-redux";
import {onReceived, setPlayerOne, setInternal} from '../actions/index';
import actioncable from 'actioncable'
import store from '../store/index'
import {Button} from 'react-bootstrap'

function mapDispatchToProps(dispatch){
  return {
    onReceived: pay => dispatch(onReceived(pay)),
    setPlayerOne: player => dispatch(setPlayerOne(player)),
    setInternal: info => dispatch(setInternal(info))
  }
}

function mapStateToProps(state){
  return state
}

const consumer = actioncable.createConsumer(API_WS_ROOT)

class PreNewMultiGameForm extends React.Component {
  state = {
    result: ''
  };

  handleChange = e => {
    this.setState({ result: e.target.value });
    console.log(this.state.result)
  };

  handleSubmit = e => {
    // e.preventDefault()
    fetch(`${API_ROOT}/one`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    }).then(res => res.json())
      .then(game =>  {
    fetch(`${API_ROOT}/players` , {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({name: 'P1', user_id: localStorage.id, multi_game_id: game.id })
  })  .then(this.props.setInternal('P1'))
      .then(this.props.setPlayerOne({name: 'P1', user_id: localStorage.id, multi_game_id: game.id }) )
      .then(this.props.history.push(`/multi/${game.id}`)) 
    })     
  };

  render = () => {
    return (
      <div className="newMultiGameForm">
      <Button className='button' onClick={(e) => this.handleSubmit(e)}>Create Room</Button>
      </div>
    );
  };
}

const NewMultiGameForm = connect( mapStateToProps, mapDispatchToProps)(PreNewMultiGameForm)

export default withRouter(NewMultiGameForm) ;