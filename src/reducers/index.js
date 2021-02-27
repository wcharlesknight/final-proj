import { ADD_USER } from "../constants/action-types";
import { configureStore } from '@reduxjs/toolkit'


const initialState = {
  users: [],
  gameWord: [],
  games: [], 
  points: []
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
      points: state.points.concat(action.payload)
    }
  }
  
  return state;
}


export default rootReducer