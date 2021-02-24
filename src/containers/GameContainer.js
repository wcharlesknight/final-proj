import React, {Component} from 'react'
import {Form, Button, InputGroup, Container,  FormControl} from 'react-bootstrap'

import { connect } from "react-redux";
import { changeWord } from '../actions/index';
import store from "../store/index";

   
function mapDispatchToProps(dispatch) {
    return {
      changeWord: word => dispatch(changeWord(word))
    };
  }  

class Game extends Component {  

    state = {
        word: '',
        currentWord: [],
        score: 0
    }

    getWord = () => {
        
        fetch('http://localhost:3000/letters')
        .then(resp => resp.json())
        .then(data => this.setState({
            currentWord: data
        }))
       this.props.changeWord(this.state.currentWord) 
    }   
    
    // scrabble test (new)
    // "https://scrabble.p.rapidapi.comwordgame/"

    // // 	"x-rapidapi-key": "a87f5b1016mshe5a42db9c818a58p1f3c56jsn8b59ca641ffc",
	// "x-rapidapi-host": "scrabble.p.rapidapi.com",
	// "useQueryString": true
    
    // https://wordsapiv1.p.rapidapi.com/words/

    // "x-rapidapi-key": "a87f5b1016mshe5a42db9c818a58p1f3c56jsn8b59ca641ffc",
    //                 "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
    //                 "useQueryString": true
    
    
    checkWord = (e) => {
        e.preventDefault()
       
       
        // console.log(e.target.children[0].value)
        fetch(` https://wordsapiv1.p.rapidapi.com/words/${e.target.children[0].value}` , {
                headers: {
                    "x-rapidapi-key": "a87f5b1016mshe5a42db9c818a58p1f3c56jsn8b59ca641ffc",
                                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                                    "useQueryString": true
                    }, 
            
            }).then(resp => resp.json())
              .then(data => this.compare(e.target.children[0].value, data))
              .catch(error => console.error("error:", error))
    }

    compare = (word, returnWord) =>  {
        
        // console.log(this.state.currentWord)

        if (returnWord.word) {
        let letters = []
        
        this.state.currentWord.filter( word => {
            // console.log(word)
            letters.forEach( lw =>  console.log(word.character.toLowerCase() == lw) )
        })

    
        
        this.state.currentWord.forEach(w => {
        if (word.split('').join(' ').includes(w.character.toLowerCase() ) ) 
            { letters.push(w.character.toLowerCase())
          
            } 
         } 
        )
       
        // letters.forEach(  letters => {
            
      
            let uniq = [...new Set(letters)]

            // // console.log(letters.character, letters.point)
            // // console.log(points)

            // var letss = []  
            // letss.push(letters)
            // console.log(letss)

            if (word.split("").sort().join('') === letters.sort().join(''))  {
                 this.addScore(letters)
            //      const filterE = letters.filter(le => )
            //     })
            //     console.log(filterE)
            }

            if (word.split("").sort().join('') === uniq.sort().join(''))  {
                this.addScore(uniq)
            //     const filterW = this.state.currentWord.filter(w => {
            //         uniq.map( wp  => w.character == wp )
            //     })
            //     console.log(filterW)
            //     // this.addScore(uniq) 
            }
            

            // console.log(letters.sort().join(''))
            // console.log(word.split('').join('')) 
        // })
        // }

    } else  
    {console.log('not a word')}
}
        

    addScore = (letters ) => {
        console.log(letters)
    }

        render(){
        return(
         
            <Container>
                   {console.log(this.props)}
               
             <Form onSubmit={this.checkWord}>
                <input type='text'></input>
                <Button type="submit" name="Submit">Check Word</Button>
             </Form>
                <Button onClick={() => this.getWord()}> Try </Button>
         
                {this.state.currentWord.map(word => <a> {word.character} </a> ) } 
            </Container>
        )
    }
}

const GameContainer = connect(
    null,
    mapDispatchToProps
  )(Game);



export default GameContainer