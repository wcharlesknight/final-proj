import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { users: state.users };
};

const ConnectedList = ({ users }) => (
  
  <ul>
    {users.map(el => (
      <li key={el.id}>{el.username}</li>
    ))}
  </ul> 
  
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;