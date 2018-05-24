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
    image1IsClicked: false,
    image2IsClicked: false,
    yourAnswerIsInImage1: null,
    yourAnswerIsInImage2: null,
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

  componentWillReceiveProps(newProps) {
    const { isCorrect } = newProps;
    const { image1IsClicked, image2IsClicked } = this.state;
    if (image1IsClicked === true && image2IsClicked === false) {
      if (isCorrect === true) {
        this.setState({yourAnswerIsInImage1: "Correct"});
      } else if (isCorrect === false) {
        this.setState({yourAnswerIsInImage1: "Wrong"});
      }
    } else if (image2IsClicked === true && image1IsClicked === false) {
      if (isCorrect === true) {
        this.setState({yourAnswerIsInImage2: "Correct"});
      } else if (isCorrect === false) {
        this.setState({yourAnswerIsInImage2: "Wrong"});
      }
    }
  }

  // true is first image is clicked, false is second image is clicked
  onAnswer = (whichImage) => {
    // check if answer is correct or wrong from the parent component
    this.props.onAnswer(whichImage, this.state.random_highlight);
    // when first image is clicked
    if (whichImage === true) {
      // wrong practice to mutate state. todo: find another way to do this
      // image1 is clicked
      this.state.image1IsClicked = true;
      // this.setState({})
    // when second image is clicked
    } else if (whichImage === false) {
      // wrong practice to mutate state. todo: find another way to do this
      // image2 is clicked
      this.state.image2IsClicked = true;
    }

  }

  render() {
    const { random_highlight, isCorrect, yourAnswerIsInImage1, yourAnswerIsInImage2 } = this.state;
    const { player_role } = this.props;

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
            className={`Image1_${yourAnswerIsInImage1}_Highlight`}
            id="image1"
            type="button"
            src={goat_image}
            onClick={() => this.onAnswer(true)}
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
            className={`Image2_${yourAnswerIsInImage2}_Highlight`}
            id="image2"
            type="button"
            src={coat_image}
            onClick={() => this.onAnswer(false)}
          />
          <h2 id="image2_name">Coat</h2>
        </div> }

      </div>
    )
  }
};

export default Images;
