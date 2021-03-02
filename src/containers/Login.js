import React, {Component} from 'react'
import {Container, Button} from "react-bootstrap"
import Form from '../components/Form'
import { connect } from "react-redux";
import { addUser} from "../actions/index";
import store from "../store/index";
import {withRouter} from 'react-router-dom'

const API = "http://localhost:3000";

function mapDispatchToProps(dispatch) {
  return {
    addUser: user => dispatch(addUser(user))
  };
}

class PreConnectLogin extends Component {  

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      username: '',
      password: '',
      error: false,
      login: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault();
    const { username, password, login  } = this.state;
    let userInfo = {username: username, password: password}
    login ? this.handleLogin(event, userInfo) : this.handleSignup(event, userInfo )  
  }

  handleAuthResponse = (data) => {
    if (data.username) {
      const { username, id, token, password } = data;
      this.setState({
        user: {
          username,
          id,
        },
        error: null,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("id", this.state.user.id)
      this.props.addUser({ username,  password, id})
      this.props.history.push("/game")
    } else if (data.error) {
      this.setState({
        error: data.error,
        login: false 
      });
    }
  };

  handleLogin = (e, userInfo) => {
    e.preventDefault()  
    fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((resp) => resp.json())
      .then((data) => this.handleAuthResponse(data))
      .catch(console.log);
  };

  handleSignup = (e, userInfo) => {
    
    e.preventDefault(); 
    fetch(API + "/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userInfo }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        this.handleAuthResponse(data);
      })
      .catch(console.log);
  };

  handleLogout = () => {
    localStorage.clear();
    this.setState({ user: {},  login: false  });

    this.props.history.push("/")
  };

  componentDidMount() {
    const token = localStorage.token;
    if (token) {
      this.persistUser(token);
    }
    // if (this.state.login)  
    //   {  this.props.history.push('/game')  }
  }

  persistUser = (token) => {
    fetch(API + "/persist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.username) {
          const { username, id } = data;
          this.setState({
            user: {
              username,
              id },
            login: true
          });
        }
      });
  };

login = () => {
  this.setState({
    login: true
  })
}

render() {
  const { username, password, error,user,  login} = this.state;
  return (
   <Container> 
    {!!error && <h1>{error}</h1>}
    <form onSubmit={this.handleSubmit}>
      <div>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name='username'
          value={username}
          onChange={this.handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name='password'
          value={password}
          onChange={this.handleChange}
        />
      </div> 
    
      <button onClick={() => this.login()} type="submit">Login</button>
      <button type="submit">Signup</button>
   

    </form>
    {
     login ?
    <Button onClick={this.handleLogout}>Logout</Button>
    : null 
    }
    </Container> 
  );
}
}
    
const Login = connect(
  null,
  mapDispatchToProps
)(PreConnectLogin);

export default withRouter(Login);

