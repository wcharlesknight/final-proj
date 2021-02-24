import React, { Component } from "react";
import { connect } from "react-redux";
import { addUser} from "../actions/index";

function mapDispatchToProps(dispatch) {
  return {
    addUser: user => dispatch(addUser(user))
  };
}

class ConnectedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })

  }

  handleSubmit(event) {
    event.preventDefault();
    debugger
    const { username, password } = this.state;
    this.props.addUser({ username,  password});
    this.setState({ username: "", password: ""});
  }

  render() {
    const { username, password } = this.state;
    return (
     
      <form onSubmit={this.handleSubmit}>
        <div>
        {console.log(this.props)}
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={this.handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit">SAVE</button>
      </form>
    );
  }
}



const Form = connect(
  null,
  mapDispatchToProps
)(ConnectedForm);

export default Form;