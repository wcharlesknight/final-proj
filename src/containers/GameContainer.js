import React, {Component} from 'react'
import {Form, Button, Row, Container, Col} from 'react-bootstrap'
import GameOver from './GameOver'
import { connect } from "react-redux";
import { addWord, 
         addGame, 
        addPoint,  
        nextRound, 
        changeTimer, 
        resetWords, 
        changeBonus, 
        resetPoints, 
        toggleGame} from '../actions/index';
import Stats from './Stats'
import {withRouter} from 'react-router-dom'

   
function mapDispatchToProps(dispatch) {
    return {
      addWord: word => dispatch(addWord(word)),
      addGame: game => dispatch(addGame(game)), 
      addPoint: point => dispatch(addPoint(point)),
      nextRound: round => dispatch(nextRound()),
      changeTimer: amount => dispatch(changeTimer(amount)),
      resetWords: word => dispatch(resetWords()),
      changeBonus: bonus => dispatch(changeBonus(bonus  )),
      resetPoints:  points => dispatch(resetPoints()),
      toggleGame: game => dispatch(toggleGame()) 
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
        error: '',
        bonusPoints: 0,
        bonusWord: 1,
        bonusOn: 1,
        gameOver: false
    
    }

    useBonus = (e) => {
        if (e.keyCode  ===  49 ){
            if (this.state.bonusPoints - 4 >= 0) {
              this.setState(prevState => {
                 return {bonusPoints: prevState.bonusPoints - 4,
                          bonusOn: 2}
                }) }
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
        if (this.props.round < 2) 
        { 
          if (this.props.timer === 0) {
            this.getWord()
            this.props.nextRound()
            this.props.changeTimer(7)
            this.props.resetWords()
            this.setBonus()
          }
              
           else {
            this.props.changeTimer(-1)
                } 
        } else
            {   
                clearInterval(time)
                this.errorMessages('Game is over!')
                this.postGame()
                this.props.toggleGame()
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
            score: `${this.props.score}` })} 
        fetch('http://localhost:3000/games', configW) 
           .then(resp => resp.json())
           .then(game => this.props.addGame({user_id: game.user_id, score: game.score})) 
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

    setBonus = () => {
      const {gameWord} = this.props
      setTimeout(() => {
        if (gameWord.length == 2){
        this.setState({
            bonusWord: 2
        }) }
        else if (gameWord.length == 5){
            this.setState({
                bonusWord: 3
            }) }
            else if (gameWord.length >= 8){
                this.setState({
                    bonusWord: 4
                }) }
                else {
                    this.setState({
                        bonusWord: 1 
                    })}
    }, 300)
    }
    wordState = (word) =>  {
      this.props.addWord(word)
      this.setBonus()
    }     
    
    fetchLetter = (le) => { 
        fetch(`http://localhost:3000/score/${le.toUpperCase()}`, config)
            .then(resp => resp.json())
            .then(data => this.addScore(data))  
    }

    compare = (word, returnWord) =>  {
        word = word.trim()
        this.props.resetPoints()
        this.setBonus()
        if (returnWord.word)  {
            if (!this.props.gameWord.includes(word)) {
              let letters = [] 
              
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
                         if (this.props.gameWord.length == 2){
                           this.setState(prevState => {
                            return {bonusPoints: prevState.bonusPoints + 1,
                                    bonusWord: 2}
                           } ) }
                          if (this.props.gameWord.length == 5){
                            this.setState(prevState => {
                             return {bonusPoints: prevState.bonusPoints + 2,
                                    bonusWord: 3}
                             } ) }
                          if (this.props.gameWord.length >= 8){
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
        this.props.addPoint(points[0].point * this.state.bonusWord * this.state.bonusOn)
        this.resetBonus()
    }

    

    
    resetBonus = () => {
        setTimeout(() => {
        this.setState({
            bonusOn: 1
        })
    }, 300)
    }

    clear = (e) => {
        if (e.target.value == 1 || e.target.value == 2 || e.target.value == 3 || e.target.value == 4)  {
            e.target.value = ''
        }
    }

    render(){
        return(
            <div>   
             {this.props.gameOver === false ?
             <Container id='canvas'>
                <Row className='box-fixed'> 
                 {this.props.points.map(point => <Button className= 'magictime tinUpOut' > {point} </Button> )}
                 <Col className='letters'  > 
                 </Col>
                </Row>
                <Row > 
                    <Col className='text-center'>
                    <div > {this.state.currentWord.map(word => <a> {word.character} </a> ) } </div>
                      <Form onSubmit={this.checkWord}>
                         <input type='text' onChange={(e) => this.clear(e)}></input>
                         <Button type="submit"  name="Submit">Check Word</Button>
                     </Form>
                     <Button className='button' data-micron='groove' onClick={() => this.getWord()}> Try </Button>
                   </Col>
                   <Col >
                        <Stats bonus={this.state.bonusOn * this.state.bonusWord} bonusPoints={this.state.bonusPoints} />
                   </Col>
                </Row>
                <Row>
                    <Col>
                       {this.props.gameWord.map(word => <div>{word}</div>)}
                    </Col>
                </Row>
                <Row>
                    <div> 
                    {this.state.error}
                    </div>
                </Row>
            </Container> 
            :  
            <GameOver gameStart={this.toggleGame}/> }
            </div>
                
        )
     }
}

const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Game);

export default GameContainer