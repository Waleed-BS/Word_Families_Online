/*
    ./client/components/AudioController.jsx
*/
import React from 'react';

/* imported components */
import { ReactMic } from 'react-mic';

class AudioController extends React.Component {

  state = {
    record: false,
    recordedBlob: '',
    isRecorded: false,
    isSent: false,
    isAnswered: false,
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.recordedBlob !== this.state.recordedBlob
  // }

  componentDidMount() {

    // if player is player_client
    if(this.props.player_role === 'player') {
      // recover the sent audio by player_host
      // when socket player_host sends audio voice to express server
      this.props.socket.on('onSendAudioToClient', (data) => {

        // rerender this component by changing the state to the new received audio
        this.setState({
          recordedBlob: data.recordedBlob
        })

        const audioPlayer = document.getElementById('audioPlayer');
        // callback to execute when audio finish playing
        audioPlayer.onended = () => {

          // remove the audio
          data.recordedBlob.blobURL = '';
          this.setState({ recordedBlob: data.recordedBlob });

          if (this.state.isAnswered === false) {
            this.startStopWatch();
          } else {
            console.log("JIOWFHJPWIFJOPAFJPOQWFJPAO")
          }

        } // audioPlayer.onended
      }); // socket.on('onSendAudioToClient'
    } // if(this.props.player_role === 'player')

  }

  startStopWatch = () => {

    const { isAnswered } = this.state;

    const minutesLabel = document.getElementById("minutes");
    const secondsLabel = document.getElementById("seconds");
    let totalSeconds = 0;

    const intervalID = setInterval(setTime, 1000);
    // to clearInterval from anywhere in this component
    this.setState({ intervalID });

    // set a timer
    function setTime() {
      // seconds start from 1 (since the function got called after a second)
      ++totalSeconds;
      // set the seconds element from 0 to 59 then then
      // then set it back to 0 when it reaches 60
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      // set the minutes element
      minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    }

    function pad(val) {
      // convert the passed value to string
      let valString = val + "";
      // if there's only one digit, add a zero
      if (valString.length < 2) {
        return "0" + valString;
      // else return the same string value
      } else {
        return valString;
      }
    }

  }

  // callback to execute when audio start recording
  startRecording = () => {
    this.setState({
      record: true
    });
  }

  // callback to execute when audio stops recording
  stopRecording = () => {
    this.setState({
      record: false
    });
  }

  // not sure when this is called yet.
  onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  // callback to execute when audio stops recording
  onStop = (recordedBlob) => {
    this.setState({
      recordedBlob: recordedBlob,
      isRecorded: true,
    });
    console.log("onStop callback");
  }

  // send voice to player_client to hear
  handleSendAudio(recordedBlob) {

    // rerender this component by changing the state to the recorded audio
    this.setState({ recordedBlob });
    // emit the audio back to player_host socket in the express server
    this.props.socket.emit('onSendAudioToServer', { recordedBlob });

  }

  render() {

    // when player answers the question
    if (this.props.isAnswered === true) {
      clearInterval(this.state.intervalID);
    }

    const { recordedBlob, isRecorded, isSent } = this.state;
    const { player_role } = this.props;

    return (
      <div className="AudioControl">

        {/* render this if player is player_host */}
        { player_role === 'director' ? <div>
          <ReactMic record={this.state.record} onStop={this.onStop} />
          <br></br>
          <button value={true} onClick={(event) => this.startRecording(event.target.value)} type="button">Record</button>
          <button value={false} onClick={(event) => this.stopRecording(event.target.value)} type="button">Stop</button>
          <br></br>
          <audio controls src={recordedBlob.blobURL}></audio>
          <br/>
          {/* enable send button if audio is recorded */}
          { isRecorded ?
            <button value={'send'} onClick={() => this.handleSendAudio(recordedBlob)} type="button">Send</button> :
            <button value={'send'} onClick={() => this.handleSendAudio(recordedBlob)} type="button" disabled>Send</button>
          }
        {/* render this if player is player_client */}
        </div> : <div>
          <br/>
          <audio id="audioPlayer" src={recordedBlob.blobURL} controls></audio>
          <br/>
          {/* stopwatch */}
          <label id="minutes">00</label>:<label id="seconds">00</label>
        </div> }

      </div>
    );
  }
}

export default AudioController;
