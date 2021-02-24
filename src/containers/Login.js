import React, {Component} from 'react'
import {Container} from "react-bootstrap"
import Form from '../components/Form'


export default class Login extends Component {  
   
   

    render() {
        return(
            <div>
              <Form />          
            </div>
        )
      }
    }
    
      //   <div className="Login body left" >
        //     <form onSubmit={(e) => this.props.handleLoginOrSignup(e, this.state)}>
        //       <label>Username</label> <br></br>
        //       <input
        //         type="text"
        //         name="username"
        //         value={this.state.username}
        //         onChange={this.handleChange}
        //       />
        //       <br />
        //       <label>Password</label><br></br>
        //       <input
        //         type="password"
        //         name="password"
        //         value={this.state.password}
        //         onChange={this.handleChange}
        //       />
        //       <br /><br></br>
        //       <input class='btn btn-outline-dark btn-lg' variant='outline-dark' type="submit" value="Submit" ></input>
        //     </form>
        //   </div>

