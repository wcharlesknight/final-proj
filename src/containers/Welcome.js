import React, {Component} from 'react'
import {Container, Button} from "react-bootstrap"
import {withRouter} from 'react-router-dom'



class Welcome extends Component {  
    
   direct = (e) => {
       this.props.history.push(e.target.id)
   }
   
//    onClick={(e) => this.direct(e)}
    render() {
        return(
           <Container className='login' > 
            {/* <a href="#!" className="button" data-micron="bounce">Bounce</a> */}
               <Button className='button' data-micron='bounce' id='/game' onClick={(e) => this.direct(e)}> Play </Button>
               <Button> Your High Scores </Button>
               <Button> Leaderboards </Button>
            </Container>
        )
      }
    }
export default withRouter(Welcome)