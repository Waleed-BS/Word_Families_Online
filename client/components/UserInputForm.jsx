/*
    ./client/components/UserInputForm.jsx
*/
import React from 'react';

/* imported components */
import WorldFamilies from './WorldFamilies.jsx';

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
  }

  handleCountryChange(countryInput) {
    this.setState({
      country: countryInput
    })
  }

  // callback to execute when player clicks on find a game button
  handleFindGameButton() {
    // disable find game button
    document.getElementById('findGame').disabled = 'true';
    // call wait from the parent component
    this.props.wait()

    // check if username && country are not empty
    // if(this.state.username === "") {
    //   this.setState({
    //     inputError: 'Please enter your username'
    //   })
    // } else if( this.state.country === "") {
    //   this.setState({
    //     inputError: 'Please enter your country'
    //   })
    // } else {
    //   this.props.startGame();
    // }
    // console.log("isPlayClicked", this.state.isPlayClicked);
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
        <button type="submit" id="findGame" name="FindGame" onClick={() => this.handleFindGameButton()}> Find a game </button>
        { inputError &&
          <div
            style={{
            fontSize: 15,
            marginTop: 40,
            marginBottom: 40,
            color: 'red' }}>
            ERROR!: {inputError}
          </div>
        }

      </div>
    );
  }
}

export default UserInputForm;
