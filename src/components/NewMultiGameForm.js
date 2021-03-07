import React from 'react';
import { API_ROOT, HEADERS } from '../constants';

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
    }).then(this.setState({ result: '' }))
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