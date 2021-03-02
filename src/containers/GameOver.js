import { connect } from "react-redux";
import React, {Component} from 'react'
import {Form, Button, Row, Container, Col, Card} from 'react-bootstrap'
import {toggleGame} from '../actions/index';


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
    
    return (
    <Card className="text-center">
         <Card.Header as="h5">Game Over</Card.Header>
    <Card.Body>
        <Card.Text>Your score was: {props.score}</Card.Text>
        <Button variant="primary" onClick={() => newGame(props)}>Play Again</Button>
        <Button variant="primary">Home Screen</Button>
    </Card.Body>
    </Card>
    )
}

const GameOver = connect(mapStateToProps, mapDispatchToProps)(GameOv)

export default GameOver