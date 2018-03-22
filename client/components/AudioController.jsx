/*
    ./client/components/AudioController.jsx
*/
import React from 'react';

/* imported components */
import { ReactMic } from 'react-mic';

class AudioController extends React.Component {

  state = {
    isRecorded: false,
    record: false,
    blobURL: '',
  }

  // callback to execute when audio start recording
  startRecording(event) {
    this.setState({
      record: true
    })
    console.log("startRecording");
  }

  // callback to execute when audio stops recording
  stopRecording(event) {
    this.setState({
      record: false
    });
    console.log("stopRecording");
  }

  // not sure when this is called yet.
  onData = (recordedBlob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  // callback to execute when audio stops recording
  onStop = (recordedBlob) => {
    this.setState({
      blobURL: recordedBlob.blobURL
    });
  }

  render() {
    const { blobURL } = this.state;
    return (
      <div className="AudioControl">
        <ReactMic record={this.state.record} onStop={this.onStop} />
        <button value={true} onClick={(event) => this.startRecording(event.target.value)} type="button">Start</button>
        <button value={false} onClick={(event) => this.stopRecording(event.target.value)} type="button">Stop</button>
        <br/>
        <audio controls src={this.state.blobURL}></audio>
      </div>
    );
  }
}
export default AudioController;
