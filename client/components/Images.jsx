/*
    ./client/components/Images.jsx
*/
import React from 'react';

/* imported component */

/* imported iamges */
import coat_image from '../assets/images/coat.jpg';
import goat_image from '../assets/images/goat.jpg';

class Images extends React.Component {

  state = {
    random_highlight: false,
  }

  componentDidMount() {
    if (this.props.player_role === 'director') {
      // 50% false 50% true
      let random_highlight = Math.random() >= 0.5;
      this.setState({
        random_highlight
      });
      // emit random highlight to the exress server
      this.props.socket.emit('onSendHighlightToServer', { random_highlight });
    } else if (this.props.player_role === 'player') {
      // receive random highlight from the express server
      this.props.socket.on('onSendHighlightToClient', (data) => {
        this.setState({
          random_highlight: data.random_highlight
        });
      });
    }
  }

  render() {
    const { player_role } = this.props;
    const { random_highlight } = this.state;
    return (
      <div className="Images">

        { player_role === 'director' ? <div>
          <img
            className={random_highlight ? 'Highlight' : ''}
            id="image1"
            alt=""
            src={goat_image}
          />
          <h2 id="image1_name">Goat</h2>
        </div> : <div>
          <img
            id="image1"
            type="button"
            src={goat_image}
            onClick={() => this.props.onAnswer(true, random_highlight)}
          />
          <h2 id="image1_name">Goat</h2>
        </div> }
        { player_role === 'director' ? <div>
          <img
            id="image2"
            className={!random_highlight ? 'Highlight' : ''}
            alt=""
            src={coat_image}
          />
          <h2 id="image2_name">Coat</h2>
        </div> : <div>
          <img
            id="image2"
            type="button"
            src={coat_image}
            onClick={() => this.props.onAnswer(false, random_highlight)}
          />
          <h2 id="image2_name">Coat</h2>
        </div> }

      </div>
    )
  }
};

export default Images;
