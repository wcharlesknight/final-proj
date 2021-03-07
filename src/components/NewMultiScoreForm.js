import React from 'react';
import { API_ROOT, HEADERS } from '../constants';

class NewMultiScoreForm extends React.Component {
  state = {
    points: '',
    multi_game_id: this.props.multiGame_id
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ multi_game_id: nextProps.multiGame_id });
  };

  handleChange = e => {
    this.setState({ points: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch(`${API_ROOT}/multi_scores`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(this.state)
    });
    this.setState({ points: '' });
  };

  render = () => {
    return (
      <div className="newMultiScoreForm">
        <form onSubmit={this.handleSubmit}>
          <label>New MultiScore:</label>
          <br />
          <input
            type="text"
            value={this.state.points}
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
        <div>Score: {this.state.points}</div>
      </div>
    );
  };
}

export default NewMultiScoreForm;