import { ADD_USER } from "../constants/action-types";
import { configureStore } from '@reduxjs/toolkit'


const initialState = {
  users: [],
  gameWord: [],
  games: [], 
  points: [],
  score: 0,
  round: 0,
  timer: 7, 
  player: '',
  gameOver: false,
  highScores: [], 
  leaders: [],
  curMultiWord: [],
  multiGame: false,
  playerOne: '',
  playerTwo: '',
  playerTwoScore: 0,
  playerOneScore: 0
};



function rootReducer(state = initialState, action) {
  if (action.type === ADD_USER) {
    return Object.assign({}, state, {
      users: state.users.concat(action.payload)
    });
  }
  else if (action.type === 'add_word'){
    return {
      ...state,
      gameWord: state.gameWord.concat(action.payload)
    }
  }
  else if (action.type === 'add_game') {
    return {
      ...state,
      games: state.games.concat(action.payload)
    } }
    else if (action.type === 'add_point'){
    return {
       ...state,
         points: state.points.concat(action.payload),
         score: state.score + action.payload
    } }
    else if (action.type == 'next_round') { 
    return {
      ...state,
        round: state.round + 1
   } }
   else if (action.type == 'change_timer') { 
    return {
      ...state,
        timer: state.timer + action.payload
   } }
   else if (action.type == 'reset_words') { 
    return {
      ...state,
      gameWord: []
   } }
   else if (action.type == 'reset_points') { 
    return {
      ...state,
      points: []
   } }
   else if (action.type == 'toggle_game') { 
    return {
      ...state,
        gameOver: !state.gameOver
    }}
    else if (action.type === 'add_high') {
      return {
        ...state,
        highScores: action.payload
      } }
    else if (action.type === 'add_leaders') {
        return {
          ...state,
          leaders: action.payload
        } }
    else if (action.type === 'cur_word') {
      return {
        ...state,
      curMultiWord: action.payload.curWord
          } }
    else if (action.type === 'add_player_two') {
        return {
        ...state,
        playerTwoScore: state.playerTwoScore + action.payload.multi_score.points
    } }
    else if (action.type === 'add_player_one') {
      return {
      ...state,
      playerOneScore: state.playerOneScore + action.payload.multi_score.points
  } }
  else if (action.type === 'set_player_one') {
    return {
    ...state,
    playerOne: action.payload.player
} }
else if (action.type === 'set_internal') {
  return {
  ...state,
  player: action.payload
} }
else if (action.type === 'player_one') {
  return {
  ...state,
  playerOne: action.payload
} }
  else if (action.type === 'set_player_two') {
    return {
    ...state,
    playerTwo: action.payload.player
} }
else if (action.type === 'add_multi_points') {
  return {
  ...state,
  multiPoints: action.payload.multi_score.points
} }
else if (action.type === 'clear_player_one') {
  return {
  ...state,
 playerOne: ''
} }
else if (action.type === 'clear_player_two') {
  return {
  ...state,
 playerTwo: ''
} }
else if (action.type === 'multi_timer') {
  return {
  ...state,
 timer: state.timer + action.payload.time 
} }
else if (action.type === 'toggle_multi') {
  return {
  ...state,
 multiGame: !state.multiGame
} }
  return state;
}


export default rootReducer