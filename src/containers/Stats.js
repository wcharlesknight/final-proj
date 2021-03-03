import { connect } from "react-redux";
import React, {Component} from 'react'
import {Card} from 'react-bootstrap'

function mapStateToProps(state) {
    return  state
}

const CurrentRo = (props) => {
    return (
    <Card className="text-center">
         <Card.Header as="h5">Round: {props.round} </Card.Header>
      <Card.Body>
        <Card.Text>Time: {props.timer} secs</Card.Text>
        <Card.Text>Round: {props.round} of 10</Card.Text>
        <Card.Text>Bonus: {props.bonus} </Card.Text>
        <Card.Text>Bonus Points: {props.bonusPoints} </Card.Text>
      </Card.Body>
    </Card>
    )
}

const Stats = connect(mapStateToProps)(CurrentRo)

export default Stats;

{/* <div> Score: {this.state.score} </div>  
<div> Time: {this.state.timer} </div> 
<div> Bonus: {this.state.bonusPoints} </div> 
<div> Bonus on  points: {this.state.bonusOn} </div> 
<div> round {this.state.round} </div>
Use Bonus:
 <div>cost 4: Press 1  for double points on next valid word </div>
 <div>cost 8: Press 2  for triple points on next valid word </div>       */}