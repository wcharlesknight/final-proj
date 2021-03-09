import React, {Fragment} from 'react';
import { API_ROOT } from '../constants';
import NewMultiGameForm from './NewMultiGameForm';
import MultiScoresArea from './MultiScoresArea';
import {withRouter} from 'react-router-dom'
import MultiplayerRoom from './MultiplayerRoom';
import { connect } from "react-redux";
import {changeChannel, currentMulti} from '../actions/index';

function mapDispatchToProps(dispatch) {
  return {
    setChannel: channel => dispatch(changeChannel(channel)),
    currentMulti: multi => dispatch(currentMulti(multi))
  } }


class PreMultiGamesList extends React.Component {
  state = {
    multiGames: [],
    activeMultiGame: null
  };

  componentDidMount = () => {
   
    fetch(`${API_ROOT}/multi_games`)
      .then(res => res.json())
      .then(multiGames => this.setState({ multiGames }));
  };

  handleClick = multi => {
    this.props.currentMulti(multi)
    this.setState({ activeMultiGame: multi.id });
    this.props.history.push(`/multi/${multi.id}`)
    
  };

  handleReceivedMultiGame = response => {
    debugger 
    const { multiGame } = response;
    this.setState({
      multiGames: [...this.state.multiGames, multiGame]
    });
  };

  handleReceivedMultiScore = response => {
    debugger
    const { multi_score } = response;
    const multiGames = [...this.state.multiGames];
    const multiGame = multiGames.find(
      multiGame => multiGame.id === multi_score.multi_game_id
    );
    multiGame.multi_scores = [...multiGame.multi_scores, multi_score];
    this.setState({ multiGames });
  };
    
  render = () => {
    const { multiGames, activeMultiGame } = this.state;
    return (
      <div className="multiGamesList">
        <h2>Multiplayer Games</h2>
        <ul>{mapMultiGames(multiGames, this.handleClick)}</ul>
        <NewMultiGameForm />
        {activeMultiGame ? (
          <MultiScoresArea
            multiGame={findActiveMultiGame(
              multiGames,
              activeMultiGame
            )}
          />
        ) : null}
      </div>
    );
  };
}

const MultiGamesList = connect(null, mapDispatchToProps)(PreMultiGamesList)

export default withRouter(MultiGamesList);

// helpers

const findActiveMultiGame = (multiGames, activeMultiGame) => {
  return multiGames.find(
    multiGame => multiGame.id === activeMultiGame
  );
};

const mapMultiGames = (multiGames, handleClick) => { 
  return multiGames.map(multiGame => {
    return (
      <li key={multiGame.id} onClick={() => handleClick(multiGame)}>
        {multiGame.result} | {multiGame.id}
      </li>
    );
  });
};