
import { ADD_USER } from "../constants/action-types";

export function addUser(payload) {
  return { type: ADD_USER, payload };
}

export function addWord(payload){
  return {type: 'add_word', payload}
}

export function addGame(payload){
  return {type: 'add_game', payload }
}

export function addPoint(payload){
  return {type: 'add_point', payload }
}

export function nextRound(payload){
  return {type: 'next_round', payload }
}

export function changeTimer(payload){
  return {type: 'change_timer', payload }
}

export function resetWords(payload){
  return {type: 'reset_words', payload }
}

export function changeBonus(payload){
  return {type: 'change_bonus', payload}
}

export function resetPoints(payload){
  return {type: 'reset_points', payload }
}

export function toggleGame(payload){
  return {type: 'toggle_game', payload }
}

export function addHigh(payload){
  return {type: 'add_high', payload }
}

export function addLeader(payload){
  return {type: 'add_leaders', payload }
}

export function changeChannel(payload){
  return {type: 'change_channel', payload }
}

export function currentMulti(payload){
  return {type: 'current_multi', payload }
}