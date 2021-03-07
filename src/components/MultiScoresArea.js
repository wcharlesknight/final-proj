import React from 'react';
import NewMultiScoreForm from './NewMultiScoreForm';

const MultiScoreArea = ({
  multiGame: { id, result, multi_scores },
}) => {
  return (
    <div className="messagesArea">
      <h2>{result}</h2>
      <ul>{orderedMultiScores(multi_scores)}</ul>
      <NewMultiScoreForm multiGame_id={id} />
    </div>
  );
};

export default MultiScoreArea

// helpers

const orderedMultiScores = multiScores => {
  const sortedMultiScores = multiScores.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedMultiScores.map(multiScore => {
    return <li >{multiScore.points}</li>;
  });
};