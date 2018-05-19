/*
    ./client/components/App.jsx
*/
import React from 'react';
import { hot } from 'react-hot-loader'
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

export default hot(module)(App)
