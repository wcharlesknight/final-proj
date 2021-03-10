import { connect } from "react-redux";
import React, {Component, useState, Fragment }  from 'react'
import {Form, Button, Row, Container, Col, Card} from 'react-bootstrap'
import {toggleGame} from '../actions/index';
import {withRouter} from 'react-router-dom'
import {useTransition, animated} from 'react-spring'


function mapStateToProps(state) {
    return  state
}
function mapDispatchToProps(dispatch) {
    return {
    toggleGame: game => dispatch(toggleGame()) 
    }}

const GameOv = (props) => {
   


    function newGame(){
        window.location.reload()
        props.toggleGame()
    }

    function homeScreen(){
        props.history.push('/welcome')
        props.toggleGame()
    }

    function multi(){
        props.history.push('/multi')
        props.toggleGame()
    }

    
    return (
    <Card className="text-center app-font">
         <Card.Header as="h5">Game Over</Card.Header>
    <Card.Body>
        {props.multiGame === true ?
              <Fragment> 
                 <Card.Text>You {props.winner === props.player ? 'Won' : 'Lost'}</Card.Text>
                 <Card.Text>Your score was: {props.score}</Card.Text>
              </Fragment>
              :
              <Card.Text>Your score was: {props.score}</Card.Text>
              
        }
        {props.multiGame === true ?
        <Button className='button' onClick={() => multi()}>Multiplayer Rooms</Button> : 
        <Button className='button' onClick={() => newGame()}>Play Again</Button>
        }   
        <Button className='button' onClick={() => homeScreen()}>Home Screen</Button>
       
    </Card.Body>
    </Card>
    )
}

const GameOver = connect(mapStateToProps, mapDispatchToProps)(GameOv)

export default withRouter(GameOver)