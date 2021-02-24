
import { ADD_USER } from "../constants/action-types";

export function addUser(payload) {
  return { type: ADD_USER, payload };
}

export function changeWord(payload){
  return {type: 'change_word', payload}
}