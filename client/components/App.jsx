/*
    ./client/components/App.jsx
*/
import React from 'react';
import './App.scss'

/* imported components */
import WorldFamilies from './WorldFamilies.jsx';

class App extends React.Component {

  render() {

    return (
      <div className="App">
        <WorldFamilies />
      </div>
    );
  }
}
export default App;
