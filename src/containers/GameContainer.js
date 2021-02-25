import React, {Component} from 'react'
import {Form, Button, Row, Container,  FormControl} from 'react-bootstrap'

import { connect } from "react-redux";
import { addWord } from '../actions/index';
import store from "../store/index";

   
function mapDispatchToProps(dispatch) {
    return {
      addWord: word => dispatch(addWord(word))
    };
  }  

class Game extends Component {  

    state = {

        currentWord: [],
        score: 0,
        timer: 7,
        usedWords: [],
        error: ''

    }

    componentDidMount(){
    //   this.timer()
    }
   
    timer = () => {
      setInterval(() => {
        if (this.state.timer === 0) {
            this.getWord()
            this.setState({
                timer: 7,
                usedWords: [] }) }
       else {
        this.setState({
            timer: this.state.timer -=  1 
             }) } }, 1000 )
    }  

    getWord = () => {  
        fetch('http://localhost:3000/letters')
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
        console.log(e.target.children[0].value)
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
    compare = (word, returnWord) =>  {
        // console.log(word, returnWord)
        const fetchLetter =  (le) => fetch(`http://localhost:3000/score/${le.toUpperCase()}`)
            .then(resp => resp.json())
            .then(data => this.addScore(data ) ) 
       
        if (returnWord.word)  {
            if (!this.state.usedWords.includes(word)) {
              let letters = []
            //   var shiftLetters =letters.slice(0, -1)
            //   var popLetters = letters.slice(1, letters.length )
             
              this.state.currentWord.forEach(w => {
                 if (word.split('').join(' ').includes(w.character.toLowerCase() ) ) 
                    { letters.push(w.character.toLowerCase()) } 
              })
              console.log(letters.slice(0, -2))
              this.countSort(letters, word.split(''))

                let uniq = [...new Set(letters)]
                let uniqW = [...new Set(word.split(''))]

                console.log(`103 submitted: ${word}, dupes: ${letters}, no dupes: ${uniq}, uniqW ${uniqW}`)
                if (word.split("").sort().join('') === letters.sort().join(''))  
                {  
                  console.log(`103 submitted: ${word}, dupes: ${letters}, no dupes: ${uniq}, uniqW ${uniqW}`)
                  this.wordState(word)
                  letters.forEach( letter => {fetchLetter(letter)})
                }   
                else if (word.split("").sort().join('') === uniq.sort().join(''))  
                     { 
                         console.log(`110 submitted: ${word}, dupes: ${letters}, no dupes: ${uniq} `) 
                         this.wordState(word)
                         uniq.forEach( letter => {fetchLetter(letter)} )                   
                     }
                     else if (word.split("").sort().join('') === letters.slice(1, letters.length ).sort().join('')) 
                        {    
                            console.log(`116 submitted: ${word}, dupes: ${letters}, no dupes: ${uniq} `) 
                            this.wordState(word)
                            letters.forEach( letter => {fetchLetter(letter)})
                        } else if (word.split("").sort().join('') === letters.slice(0, -1).sort().join(''))
                        { 
                            console.log(` 126 submitted: ${word}, dupes: ${letters}, no dupes: ${uniq} `) 
                            this.wordState(word)
                            letters.forEach( letter => {fetchLetter(letter)})
                        }
                        else {

                        console.log(`submitted: ${word}, shift: ${letters.slice(1, letters.length )}, no dupes: ${uniq} `) 
                        console.log(`submitted: ${word}, pop: ${letters.slice(0, -1)}, no dupes: ${uniq} `) 
                           this.errorMessages('All letters do not match')
                       }
                      
                    } else 
                    this.errorMessages('You have alredy used that word')
            }  else  
            { this.errorMessages('Not a real word') }
    }
    
    addScore = (points) => {
        this.setState(prevState => {
            return {score: prevState.score += points[0].point }
        } )
    }

    countSort = (array, wordArr) => {
  
        let wordC = Object.create(null);
        let counter = Object.create(null);

        array.forEach(function(word) {
            counter[word] = (counter[word] || 0) + 1;

             array.sort(function(x, y) {
                 return (counter[y] - counter[x] )
            });

        }); 
    //     wordArr.forEach(function(word) {
    //         if ( counter[word] = counter[word] - 1 > 0)
    //          counter[word] = counter[word] - 1 
           
    // }); 

       

        console.log(counter)
        // console.log(wordC)
    }

    render(){
        return(
            
            <Container>
                <Row> 
                  <div> Score: {this.state.score} </div>  
                  <div> Time: {this.state.timer} </div> 
             <Form onSubmit={this.checkWord}>
                <input type='text'></input>
                <Button type="submit" name="Submit">Check Word</Button>
             </Form>
                <Button onClick={() => this.getWord()}> Try </Button>
         
                {this.state.currentWord.map(word => <a> {word.character} </a> ) } 
                </Row>
                <Row> 
                    {this.state.usedWords.map(word => <div>{word}</div>)}
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
    null,
    mapDispatchToProps
  )(Game);

export default GameContainer