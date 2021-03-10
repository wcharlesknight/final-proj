
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

export function setPlayerOne(payload){
  return ({type: 'player_one', payload})
}

export function setPlayerTwo(payload){
  return ({type: 'set_player_two', payload})
}

export function clearPlayerOne(payload){
  return ({type: 'clear_player_one', payload})
}

export function clearPlayerTwo(payload){
  return ({type: 'clear_player_two', payload})
}

export function toggleMulti(payload){
  return ({type: 'toggle_multi', payload})
}

export function setInternal(payload){
  return ({type: 'set_internal', payload})
}

export function gameInitialize(payload){
  return ({type: 'game_initialize', payload})
}

export function onReceived(payload){
  if (Object.keys(payload).includes('player')) {
    if (payload.player.name.includes('P1') === true) {
      console.log(payload, 'set player one')
      return {type: 'set_player_one', payload}
    } 
    if (payload.player.name.includes('P2') === true) {
      console.log(payload, 'set player two')
      return {type: 'set_player_two', payload}
    } 
  }
  else if (Object.keys(payload).includes('multi_score')) {
        if (payload.multi_score.name.includes('P1')) {
          return {type: 'add_player_one', payload}
          } else {
            return {type: 'add_player_two', payload}
          } 
        }
  else if (Object.keys(payload).includes('curWord')) {
    return {type: 'cur_word', payload}
        }
  else if (Object.keys(payload).includes('toggle_game')) {
        return {type: 'toggle_game', payload}
      }
  else if (Object.keys(payload).includes('toggleMulti')){
    return {type: 't_multi', payload}
  }
  else if (Object.keys(payload).includes('time')) {
      return {type: 'multi_timer', payload }
      }
   }
  
