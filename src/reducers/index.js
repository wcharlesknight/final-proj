import { ADD_USER } from "../constants/action-types";
import { configureStore } from '@reduxjs/toolkit'


const initialState = {
  users: [],
  gameWord: ''
};



function rootReducer(state = initialState, action) {
  if (action.type === ADD_USER) {
    return Object.assign({}, state, {
      users: state.users.concat(action.payload)
    });
  }
  else if (action.type === 'change_word'){
    state.gameWord = action.payload
  }
  return state;
}


export default rootReducer