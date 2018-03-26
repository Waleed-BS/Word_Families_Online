/*
    ./client/components/UserInputForm.jsx
*/
import React from 'react';
import { connect } from 'react-redux';

/* imported components */
import WorldFamilies from './WorldFamilies.jsx';

/* imported actions */
import { updateRole } from '../actions/Role_Actions.jsx';

class UserInputForm extends React.Component {

  state = {
    username: '',
    country: '',
    inputError: '',
  }

  handleUsernameChange(usernameInput) {
    this.setState({
      username: usernameInput
    })
    console.log(this.props.role)
    // console.log("this.state.username", this.state.username);
  }

  handleCountryChange(countryInput) {
    this.setState({
      country: countryInput
    })
    // console.log("this.state.country", this.state.country);
  }

  handlePlayButton() {
    if(this.state.username === "") {
      this.setState({
        inputError: 'Please enter your username'
      })
    } else if( this.state.country === "") {
      this.setState({
        inputError: 'Please enter your country'
      })
    } else {
      this.props.startgame();
    }
    // console.log("isPlayPressed", this.state.isPlayPressed);
  }

  handleRoleChange(newRole) {
    this.props.updateRoleDispatch(newRole)
    console.log(this.props.role)
  }

  render() {
    const { inputError } = this.state;
    return (
      <div className="UserInputForm">
        <label> Username </label>
        <input type="text" id="username" name="Username" value={this.state.username} onChange={(event) => this.handleUsernameChange(event.target.value)} />
        <br></br>
        <br></br>
        <label> Country </label>
        <input type="text" id="country" name="Country" value={this.state.country} onChange={(event) => this.handleCountryChange(event.target.value)} />
        <br></br>
        <br></br>
        <label> Role </label>
        <select onChange={(event) => this.handleRoleChange(event.target.value)} >
	        <option value="director">Director</option>
	        <option value="player">Player</option>
        </select>
        <br></br>
        <br></br>
        <button type="submit" name="Play" onClick={() => this.handlePlayButton()}> Play </button>
        {
          inputError &&
          <div style={{ fontSize: 15, marginTop: 40, marginBottom: 40, color: 'red' }}>ERROR!: {inputError} </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.role,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateRoleDispatch: (role) => dispatch(updateRole(role))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInputForm);
