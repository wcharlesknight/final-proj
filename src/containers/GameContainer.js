import React, {Component} from 'react'
import {Form, Button, Row, Container, Col} from 'react-bootstrap'

import { connect } from "react-redux";
import { addWord, addGame } from '../actions/index';
import store from "../store/index";

   
function mapDispatchToProps(dispatch) {
    return {
      addWord: word => dispatch(addWord(word)),
      addGame: game => dispatch(addGame(game))
    };
  }

function mapStateToProps(state) {
    return  state
}
let token = localStorage.token;
let config = {method: 'GET', headers: {'Content-Type': 'application/json', 
Authorization: `Bearer ${token}`}  } 

class Game extends Component {  

    state = {

        currentWord: [],
        score: 0,
        timer: 7,
        usedWords: [],
        error: '',
        bonusPoints: 0,
        bonusWord: 1,
        bonusOn: 1,
        round: 0
    
    }

    useBonus = (e) => {
        if (e.keyCode  ===  49 ){
            if (this.state.bonusPoints - 4 >= 0) {
              this.setState(prevState => {
                 return {bonusPoints: prevState.bonusPoints - 4,
                          bonusOn: 2}
                })} 
            else 
                 this.errorMessages('Not enough bonus points')
        }
        if (e.keyCode  ===  50 ){
            if (this.state.bonusPoints - 8 >= 0) {
                this.setState(prevState => {
                   return {bonusPoints: prevState.bonusPoints - 8,
                            bonusOn: 3}
                  })} 
              else 
                   this.errorMessages('Not enough bonus points')
        }
        if (e.keyCode  ===  51 ){
            this.errorMessages('3 was pressed')
        }
        if (e.keyCode  ===  52 ){
            this.errorMessages('4 was pressed')
            this.timer()
        } 
    }

    componentDidMount(){
        // this.timer()
        document.addEventListener("keydown", this.useBonus, false);
      }

      componentWillUnmount(){
        document.removeEventListener("keydown", this.useBonus, false);
      }

    
 
     timer = () => {
        let time = setInterval(() => {
        if (this.state.round < 10) 
        {
          if (this.state.timer === 0) {
            this.getWord()
            this.setState(prevState => {
             return {   
                timer: 7,
                usedWords: [],
                round: prevState.round + 1   }}) }
           else {
            this.setState({
                 timer: this.state.timer -=  1 
                   }) } 
        } else
            {   
                clearInterval(time)
                this.errorMessages('Game is over!')
                this.postGame() 
            }
        }, 1000) 
    }
    
  
    postGame = () => {
        console.log('i made it')
        const token = localStorage.token;
        let configW = { method: 'POST',
        headers: {'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`},
        body: JSON.stringify({
            user_id: localStorage.id,
            score: `${this.state.score}` })} 
        fetch('http://localhost:3000/games', configW) 
           .then(resp => resp.json())
           .then(game => console.log(game)) 
}

    getWord = () => {  
        fetch('http://localhost:3000/letters', config )
        .then(resp => resp.json())
        .then(data => this.setState({
            currentWord: data
        }))
    }

    errorMessages = (message) => {
        this.setState({
            error: message
        })
        setTimeout(() => {
            this.setState({
                error: ''
            })
        }, 1500)
    }
    
    checkWord = (e) => {
        e.preventDefault() 
        if (e.target.children[0].value.length >= 3) {
        fetch(` https://wordsapiv1.p.rapidapi.com/words/${e.target.children[0].value}` , {
                headers: {
                    "x-rapidapi-key": "a87f5b1016mshe5a42db9c818a58p1f3c56jsn8b59ca641ffc",
                                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                                    "useQueryString": true
                    }, 
            }).then(resp => resp.json())
              .then(data => {
                   this.compare(e.target.children[0].value, data)
                   e.target.children[0].value = ''  })
              .catch(error => console.error("error:", error))
              }
        else {
            e.target.children[0].value = '' 
            this.errorMessages("Word must be at least three letters")
        }
    }

    wordState = (word) =>  {
      this.props.addWord(word)
      this.setState(prevState  => {
            return { usedWords: [...prevState.usedWords, word]  } }  )
    }     
    
    fetchLetter = (le) => { 
        fetch(`http://localhost:3000/score/${le.toUpperCase()}`, config)
            .then(resp => resp.json())
            .then(data => this.addScore(data))  
    }

    compare = (word, returnWord) =>  {
        word = word.trim()
        if (returnWord.word)  {
            if (!this.state.usedWords.includes(word)) {
              let letters = []
                this.setState({
                    bonusWord: 1 
                })
              this.state.currentWord.forEach(w => {
                 if (word.split('').join(' ').includes(w.character.toLowerCase() ) ) 
                    { letters.push(w.character.toLowerCase()) } 
              })
                let uniq = [...new Set(letters)]
                let uniqW = [...new Set(word.split(''))]
                if (uniqW.sort().join('') == uniq.sort().join('')) {
                    let counter = Object.create(null);
                    let validity = 0 
                    letters.forEach(w  => {
                        counter[w] = (counter[w] || 0) + 1;
                    }); 
                    word.split('').forEach(word2 => {
                        counter[word2] -= 1 
                       if (counter[word2] < 0 )
                        {validity++}
                    }); 
                   if (validity == 0) 
                     {  
                         if (this.state.usedWords.length == 2){
                           this.setState(prevState => {
                            return {bonusPoints: prevState.bonusPoints + 1,
                                    bonusWord: 2 }
                           } ) }
                          if (this.state.usedWords.length == 5){
                            this.setState(prevState => {
                             return {bonusPoints: prevState.bonusPoints + 2,
                                    bonusWord: 3}
                             } ) }
                          if (this.state.usedWords.length >= 8){
                                this.setState(prevState => {
                                 return {bonusPoints: prevState.bonusPoints + 3,
                                    bonusWord: 4}
                                } ) } 
                        this.wordState(word)
                        word.split('').forEach( letter => {this.fetchLetter(letter)}) 
                      }
                      else 
                   return this.errorMessages('All letters do not match') 
                } else 
               return this.errorMessages('All letters do not match')
             } else 
            return this.errorMessages('You have alredy used that word')
        }  else 
            {
             this.errorMessages('Not a real word')
             this.setState(prevState => {
               return {score: prevState.score - 1}})
            }   
    }
    
    addScore = (points) => {
        console.log(points[0].point)
        console.log('bonusOn:', this.state.bonusOn)
        this.setState(prevState => {
            return {score: prevState.score += points[0].point * this.state.bonusWord * this.state.bonusOn} } )
        this.resetBonus()
    }

    resetBonus = () => {
        setTimeout(() => {
        this.setState({
            bonusOn: 1 
        }) }, 300)
    }

    clear = (e) => {
        if (e.target.value == 1 || e.target.value == 2 || e.target.value == 3 || e.target.value == 4)  {
            e.target.value = ''
        }
    }

    render(){
        return(
            
            <Container id='canvas'>
                <Row> 
                    <Col> 
                       <div> Score: {this.state.score} </div>  
                       <div> Time: {this.state.timer} </div> 
                       <div> Bonus: {this.state.bonusPoints} </div> 
                       <div> Bonus on  points: {this.state.bonusOn} </div> 
                       <div> round {this.state.round} </div> 
                      <Form onSubmit={this.checkWord}>
                         <input type='text' onChange={(e) => this.clear(e)}></input>
                         <Button type="submit" name="Submit">Check Word</Button>
                     </Form>
                     <Button className='button' data-micron='groove' onClick={() => this.getWord()}> Try </Button>
                     <div> <Button onClick={() => this.postGame()}>Test</Button> </div>
                     {this.state.currentWord.map(word => <a> {word.character} </a> ) } 
                   </Col>
                   <Col>
                    Use Bonus:
                        <div>cost 4: Press 1  for double points on next valid word </div>
                        <div>cost 8: Press 2  for triple points on next valid word </div>        
                   </Col>
                </Row>
                <Row>
                    <Col>
                       {this.state.usedWords.map(word => <div>{word}</div>)}
                    </Col>
                </Row>
                <Row>
                    <div> 
                    {this.state.error}
                    </div>
                </Row>
            </Container>
        )
     }
}

const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Game);

export default GameContainer