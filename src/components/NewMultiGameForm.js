import React from 'react';
import { API_ROOT, API_WS_ROOT, HEADERS } from '../constants';
import {withRouter} from 'react-router-dom'
import { connect } from "react-redux";
import {onReceived, setPlayerOne} from '../actions/index';
import actioncable from 'actioncable'
import store from '../store/index'

function mapDispatchToProps(dispatch){
  return {
    onReceived: pay => dispatch(onReceived(pay)),
    setPlayerOne: player => dispatch(setPlayerOne(player))
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
    e.preventDefault()
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
  })
      .then(this.props.setPlayerOne({name: 'P1', user_id: localStorage.id, multi_game_id: game.id }) )
      .then(this.props.history.push(`/multi/${game.id}`)) 
    })     
  };

  render = () => {
    return (
      <div className="newMultiGameForm">
        <form onSubmit={this.handleSubmit}>
          <label>New Multiplayer Game:</label>
          <br />
          <input
            type="text"
            value={this.state.result}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
      </div>
    );
  };
}

const NewMultiGameForm = connect( mapStateToProps, mapDispatchToProps)(PreNewMultiGameForm)

export default withRouter(NewMultiGameForm) ;