import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  login = () => {
    alert('login');
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button><img className="App-button" src="https://www.bankid.com/en/_themes/bankid-www/img/logo1-default.svg" alt="Log In" onClick={this.login} /></button>
      </div>
    );
  }
}

export default App;
