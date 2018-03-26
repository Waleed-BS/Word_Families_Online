/*
    ./client/components/WorldFamilies.jsx
*/
import React from 'react';

/* imported component */
import UserInputForm from './UserInputForm.jsx';
import Images from './Images.jsx';
import AudioController from './AudioController.jsx';

class WorldFamilies extends React.Component {

  state = {
    isPlayPressed: false,
    role: '',
  }

  // function to be passed as props to UserInputForm component
  handlePlayButton = () => {
    this.setState({
      isPlayPressed: true
    })
    console.log("isPlayPressed", this.state.isPlayPressed);
  }

  render() {
    const { isPlayPressed } = this.state;
    return (
      <div className="WorldFamilies">
        {
          isPlayPressed ?
          <div>
            <Images />
            <AudioController />
          </div>
          :
          <UserInputForm startgame={this.handlePlayButton} />
        }
      </div>
    );
  }
}
export default WorldFamilies;
