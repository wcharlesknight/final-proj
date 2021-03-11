import { connect } from "react-redux";
import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {RiFileWordFill} from "react-icons/ri";

function mapStateToProps(state) {
    return  state
}

const CurrentRo = (props) => {
    return (
    <Card className="text-center">
      <RiFileWordFill className='right white-text' /> 
       
         <Card.Header className='back-image-real white-text purple-border' as="h5">
         <RiFileWordFill  className='lit-word-left-s' size='17' />
           Round: {props.round} </Card.Header>
       <Card.Body>
        <Card.Text>Time: {props.timer} secs</Card.Text>
        {props.round > 10 ? 
        <Card.Text >Game Over</Card.Text>
        :
        <Card.Text >Round: {props.round} of 10</Card.Text>
        }
        <Card.Text>Bonus: {props.bonus} </Card.Text>
        <Card.Text>Bonus Points: {props.bonusPoints} </Card.Text>
      </Card.Body>
      <RiFileWordFill/> 
      <RiFileWordFill className='bottom-r-1' /> 
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