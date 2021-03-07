import React from 'react';
import { API_ROOT, HEADERS } from '../constants';
import {withRouter} from 'react-router-dom'

class NewMultiGameForm extends React.Component {
  state = {
    result: ''
  };

  handleChange = e => {
    this.setState({ result: e.target.value });
    console.log(this.state.result)
  };

  handleSubmit = e => {
    e.preventDefault()
    fetch(`${API_ROOT}/multi_games`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    }).then(res  => res.json())
      .then(game =>  {
      this.props.onReceived({player: {name: 'P1', user_id: localStorage.id, multi_game_id: game.id}})  
      this.props.history.push(`/multi/${game.id}`)
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

export default NewMultiGameForm ;