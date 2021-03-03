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
  gameOver: false,
  highScores: [], 
  leaders: []
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
   
  
  
  return state;
}


export default rootReducer