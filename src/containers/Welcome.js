import React, {Component} from 'react'
import {Container, Button, Row, Card, Col} from "react-bootstrap"
import {withRouter} from 'react-router-dom'
import {addHigh, addLeader} from '../actions/index'
import { connect } from "react-redux";
import {GiCrossedSwords} from 'react-icons/gi'

function mapDispatchToProps(dispatch) {
    return {
      addHigh: score => dispatch(addHigh(score)),
      addLeader: score => dispatch(addLeader(score))
    } } 

function mapStateToProps(state) {
     return  state
}

class PreWelcome extends Component {  
    
    state = {
        scoreBox: 'invisible',
        leaders: true 
    }
    
   direct = (e) => {
       this.props.history.push(e.target.id)
   }

   componentDidMount(){
       this.props.addHigh([])
       this.props.addLeader([])
   }

   showHighScores = () => {
    let token = localStorage.token;
    let configE = {method: 'GET', headers: {'Content-Type': 'application/json', 
    Authorization: `Bearer ${token}`}  } 
       fetch(`http://localhost:3000/highscore/${localStorage.id}`, configE)
        .then(resp => resp.json())
        .then(data => { 
            this.props.addLeader([])
            this.props.addHigh(data) 
            this.setState({
                scoreBox: '', 
                leaders: false
            })}) 
   }
   
   showLeaders = () => {
    let token = localStorage.token;
    let configE = {method: 'GET', headers: {'Content-Type': 'application/json', 
    Authorization: `Bearer ${token}`}  } 
       fetch(`http://localhost:3000/leaders`, configE)
        .then(resp => resp.json())
        .then(data => {
            this.props.addHigh([])
            this.props.addLeader(data) 
            this.setState({
                scoreBox: '',
                leaders: true 
            })} )
     }
   
    render() {
        return(
        
           <Container className='login position-relative app-font'>
               
               {this.state.scoreBox === 'invisible' ?
               
               <Row className='game-page flex'>
                   
                <GiCrossedSwords className='swords-left' size='32' />
                <Card className='score-box' border='dark' >
                  <Card.Header className='card-h text-white' as='h2'>Speed Words</Card.Header>
                  <Button className='button' data-micron='bounce' id='/game' onClick={(e) => this.direct(e)}> Play </Button>
                  <Button className='button' data-micron='bounce' id='/multi' onClick={(e) => this.direct(e)}> Multiplayer Game </Button>
                  <Button className='button' data-micron='squeeze' onClick={() => this.showHighScores()}> Your High Scores </Button>
                  <Button className='button' data-micron='blink'onClick={() => this.showLeaders()}> Leaderboards</Button>
                  <Button className='button' id='/' onClick={(e) => this.direct(e)}>Back to Login</Button> 
                  </Card>
                  <GiCrossedSwords className='swords-right' size='32' />
               </Row>

               :
               <Row className='game-page flex'>
                     <GiCrossedSwords className='swords-left' size='32' />
                   <Col className={this.state.scoreBox}>
                 
                   <Card className='score-box text-center'>
                   <Card.Header as="h5">{this.state.leaders ? 'Leaders' : 'Your High Scores'}</Card.Header>
                   {this.state.leaders ? 
                   <Card.Body> 
                        <ol> 
                             {this.props.leaders.map(user => <Card.Text><li className='text-center'> {`Points: ${user.score} | Date: ${user.created_at.slice(0,10)} | User: ${user.user.username}`}</li> </Card.Text>) }
                        </ol>
                        <Button className='button' onClick={() => this.setState({scoreBox: 'invisible'})}>Close</Button>
                    </Card.Body> 
                    : 
                    <Card.Body> 
                        <ol>    
                              {this.props.highScores.map(user => <Card.Text ><li className='text-center'> {`Points: ${user.score} | Date: ${user.created_at.slice(0,10)}`}</li></Card.Text> ) }
                         </ol>
                        <Button className='button' onClick={() => this.setState({scoreBox: 'invisible'})}>Close</Button>
                  </Card.Body>
                   }
                   </Card>
                   </Col>
                   <GiCrossedSwords className='swords-right' size='32' />
               </Row>

                }
            </Container>
        )
      }
    }

const Welcome = connect(mapStateToProps, mapDispatchToProps)(PreWelcome)
export default withRouter(Welcome)