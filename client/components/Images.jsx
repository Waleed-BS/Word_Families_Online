/*
    ./client/components/Images.jsx
*/
import React from 'react';

/* imported component */

class Images extends React.Component {

  state = {
    something: null,
    random_bolean: false,
  }

  render() {

    // if( this.props.role === 'player') {
    //   // random_bolean = Math.random() >= 0.5;
    //   this.setState({
    //     random_bolean: (Math.random() >= 0.5),
    //   })
    //   console.log('role =', this.props.role)
    //   console.log('this.state.random_bolean', this.state.random_bolean)
    // }

    return (
      <div className="Images">
        <img
          className={this.state.random_bolean ? 'Highlight' : ''}
          width="400"
          height="400"
          alt=""
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Domestic_goat_kid_in_capeweed.jpg/1200px-Domestic_goat_kid_in_capeweed.jpg"
        />
        <img
          className={!this.state.random_bolean ? 'Highlight' : ''}
          width="400"
          height="400"
          alt=""
          src="http://www.patagonia.com/dis/dw/image/v2/ABBM_PRD/on/demandware.static/-/Sites-patagonia-master/default/dwe19a46b4/images/hi-res/68255_BLK.jpg?sw=750&sh=750&sm=fit&sfrm=png"
        />
      </div>
    )
  }
};

export default Images;
