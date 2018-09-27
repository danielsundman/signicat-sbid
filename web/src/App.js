import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    authReference: null
  };

  componentDidMount = () => {
    this.timer = setInterval(this.poll, 2000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
    this.timer = null;
  };

  logout = async () => {
    try {
      const { authReference } = this.state;
      await axios.delete(`http://localhost/${authReference}`);
      this.setState({ authReference: null, data: null });
    } catch (e) {
      alert(e);
    }
  };

  login = async () => {
    try {
      const pno = prompt('pno');
      const { data: { authReference } } = await axios.post(`http://localhost/authenticate/${pno}`);
      this.setState({ authReference });
    } catch (e) {
      this.setState({ authReference: null, data: null });
      console.log('e', e);
    }
  };

  poll = async () => {
    if (!this.state.authReference || this.state.data) return;
    try {
      const { authReference } = this.state;
      const res = await axios.get(`http://localhost/peek/${authReference}`);
      const { data } = res;
      if (data) {
        this.setState({ data });
      }
    } catch (e) {
      this.setState({ authReference: null, data: null });
      console.log('e', e);
    }
  };

  renderUserInfo = () => {
    if (this.state.data && this.state.data.userInfo) {
      const userInfo = this.state.data.userInfo;
      return (
        <div>
          <h2>Logged In!</h2>
          <p>name: {userInfo.name}</p>
          <p>Given name: {userInfo.given_name}</p>
          <p>Token: {this.state.data.token}</p>
        </div>
      );
    }
    return null;
  };

  render() {
    const userInfo = this.renderUserInfo();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <br />
        {
          !userInfo && !this.state.authReference &&
          <button>
            <img className="App-button"
                 src="https://www.bankid.com/en/_themes/bankid-www/img/logo1-default.svg"
                 alt="Log In"
                 onClick={this.login} />
          </button>
        }
        {
          this.state.authReference && !this.state.data &&
          <img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif"
               alt="Logging In" />
        }
        {
          userInfo && (
            <div>
              {userInfo}
              <br />
              <br />
              <button onClick={this.logout}>Logout!</button>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
