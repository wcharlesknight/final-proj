import React, { Fragment } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';

const Cable = ({ multiGames, handleReceivedMultiScore }) => {
  return (
    <Fragment>
      {multiGames.map(multiGame => {
        return (
          <ActionCableConsumer
            key={multiGame.id}  
            channel={{ channel: 'MultiScoresChannel', multi_game_id: multiGame.id }}
            onReceived={handleReceivedMultiScore}
          />
        );
      })}
    </Fragment>
  );
};

export default Cable;