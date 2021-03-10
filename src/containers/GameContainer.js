import React, {Component} from 'react'
import {Form, Button, Row, Container, Col, Card} from 'react-bootstrap'
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
        toggleGame,
        gameInitialize } from '../actions/index';
import Stats from './Stats'
import {withRouter} from 'react-router-dom'
import backimage from '../backimage.png'
import { FaBold } from 'react-icons/fa'
import {RiFileWordFill} from "react-icons/ri";
import  {GiPowerLightning} from  "react-icons/gi";
import {FcFlashAuto} from  "react-icons/fc";
import {useTransition, animated} from 'react-spring'


var sectionStyle = {
  backgroundImage: `url(${backimage})`
}

   
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
      toggleGame: () => dispatch(toggleGame()),
      gameInitialize: () => dispatch(gameInitialize())
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
        bonusUsed: false

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
        this.props.gameInitialize()
        document.addEventListener("keydown", this.useBonus, false);
      }

      componentWillUnmount(){
        document.removeEventListener("keydown", this.useBonus, false);
      }

    
 
     timer = () => {
        let time = setInterval(() => {
        if (this.props.round < 11) 
        { 
          if (this.props.timer === 0) {
            this.getWord()
            this.props.multiGame === true ? this.props.multiRound(1) : this.props.nextRound()
            this.props.multiGame === true ? this.props.multiTimer(7) : this.props.changeTimer(7) 
            this.props.multiGame === true ? this.props.multiReset() : this.props.resetWords()
            this.setBonus()
          }
           else {
            this.props.multiGame === true ? this.props.multiTimer(-1) : this.props.changeTimer(-1) 
            }
        } else
            {   
                clearInterval(time)
                this.errorMessages('Game is over!')
                this.postGame()
                this.props.multiGame === true ? this.props.endGame('end') : this.props.toggleGame()
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
        .then(data =>  {
            this.props.multiGame === true ? this.props.curWord(data) : this.setState({currentWord: data}) 
      })
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
              // compare word this.state.currentWord for single player
              if (this.props.multiGame === true) {
                this.props.curMultiWord.forEach(w => {
                 if (word.split('').join(' ').includes(w.character.toLowerCase() ) ) 
                    { letters.push(w.character.toLowerCase()) } 
                }) 
              }
              else {
                this.state.currentWord.forEach(w => {
                    if (word.split('').join(' ').includes(w.character.toLowerCase() ) ) 
                       { letters.push(w.character.toLowerCase()) } 
                   }) 
              }
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
            this.addScore([{point: -1}])
            }   
    }
    
    addScore = (points) => {
        if (this.state.bonusWord * this.state.bonusOn > 1 && points[0].point > 0) {
            this.setState({bonusUsed: true})
            this.resetBonus()
        }    
        points[0].point > 0 ? this.props.addPoint(points[0].point * this.state.bonusWord * this.state.bonusOn) : this.props.addPoint(points[0].point )
        if (this.props.multiGame === true) {
        this.props.addMultiPoints(points[0].point * this.state.bonusWord * this.state.bonusOn)
         } 
    }

    resetBonus = () => {
        setTimeout(() => {
        this.setState({
            bonusOn: 1,
            bonusUsed: false
        })
    }, 1000)
    }

    clear = (e) => {
        if (e.target.value == 1 || e.target.value == 2 || e.target.value == 3 || e.target.value == 4)  {
            e.target.value = ''
        }
    }

    exitGame = () => {
        this.props.history.push('/welcome')
        window.location.reload()
    }



    render(){
        return(
            <div>   
             {this.props.gameOver === false ?
             <Container  id='canvas' fluid className='full-height app-font'>
                <Row className='box-fixed text-center black-back border-bottom border-white white-text'>
                { this.props.multiGame === true ? 
                  <div>     
                    <h1 className='opponent-score'>P1: {this.props.playerOneScore}</h1>
                    <h1 className='opponent-score-2'>P2: {this.props.playerTwoScore}</h1> 
                  </div>
                  :         //SCORE
                 <div className='position-fixed score-top'>Score: {this.props.score}</div> }
                {this.props.round === 0 ?
                <div className='position-fixed countdown'> Game starts in: {this.props.timer} </div>
                :   <div className='position-fixed countdown invisible'> Game starts in: {this.props.timer} </div> }
                {/* FLYING POINTS */}
                 <div className='flying-words'> {this.props.points.map(point => point > 0 ? <Button className= 'm-1 green magictime tinUpOut z-pos border border-white border-5' > + {point} </Button>  : <Button className= 'red magictime tinDownOut z-pos border border-white border-5' > {point} </Button> ) }</div> 
                 {/* CURRENT WORD BOX   */}
                { this.props.multiGame === true ? 
                 <div className='words m-2'> {this.props.curMultiWord.map( (word, index) => <a key={index} className='magictime spaceInUp tile m-1'> {word.character}<span>{word.point}</span> </a> ) } </div>
                 :
                  <div className='words m-2'> {this.state.currentWord.map((word, index)=> <a key={index} className='magictime spaceInUp tile m-1'> {word.character}<span>{word.point}</span> </a> ) } </div>
                } 
                {
                    // MULTIPLIER AMOUNT
                    this.state.bonusUsed === true ? 
                    <h3 className='multiplier magictime tinLeftOut'> NICE! </h3> :
                <h3 className={this.state.bonusOn * this.state.bonusWord > 1 ? 'multiplier magictime vanishIn': 'multiplier invisible' } > Current Multiplier: {`${this.state.bonusOn * this.state.bonusWord}x`} </h3>
                      
            }
                </Row>
                <Row className='box-fixed-2 back-image'>
                <Col className='text-center rotate-back'>
                        <Stats bonus={this.state.bonusOn * this.state.bonusWord} bonusPoints={this.state.bonusPoints} />
                        <Button className='button' onClick={() => this.exitGame() }>Exit Game</Button>
                   </Col>
                    <Col className='text-center rotate-back'>
                      <Form  onSubmit={this.checkWord}> 
                         <input type='text' onChange={(e) => this.clear(e)}></input>
                         <Button  className='button' type="submit"  name="Submit">Check Word</Button>
                     </Form>
                     {/* <Button className='button' data-micron='groove' onClick={() => this.getWord()}> Try </Button> */}
                     <div className='white-error position-fixed' > 
                      {this.state.error}
                     </div>
                   </Col>
                   <Col className='text-center rotate-back'>
                 
                       <Card className='used-words'>
                       <RiFileWordFill/> <Card.Header>Used Words</Card.Header>
                       <RiFileWordFill className='bottom-r-1' /> 
                           <Card.Body> 
                                {this.props.gameWord.map(word => <Card.Text className=' m-0'>{word}</Card.Text>)}
                            </Card.Body>
                        <RiFileWordFill className='right' /> 
                        <RiFileWordFill/> 
                       </Card>
                    </Col>
                </Row>
                <Row className='box-fixed black-back border-top border-white'>
                    <Card className='text-center'> 
                        <Card.Header>Power-ups</Card.Header>
                        
                        <Card.Body> 
                        <h5> <FcFlashAuto />   Press '1' to use 2x multiplier (4 bonus points)</h5>
                        <h5> <GiPowerLightning />   Press '2' to use 3x multiplier (8 bonus points)</h5>
                        </Card.Body>
                    </Card>
                </Row>
            </Container> 
            :  
            <GameOver winner={this.props.playerOneScore > this.props.playerTwoScore ? 'P1' : 'P2'} gameStart={this.toggleGame}/> }
            </div>
        )
     }
}

const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Game);

export default withRouter(GameContainer)