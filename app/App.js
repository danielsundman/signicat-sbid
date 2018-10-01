import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
// import logo from "../web/src/logo.svg";

export default class App extends React.Component {
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
      // const pno = prompt('pno');
      const pno = '200101018539';
      const { data: { authReference } } = await axios.post(`http://localhost/authenticate/${pno}`);
      this.setState({ authReference });
    } catch (e) {
      this.setState({ authReference: null, data: null });
      console.log('eee', e);
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
        <View>
          <Text>Logged In!</Text>
          <Text>name: {userInfo.name}</Text>
          <Text>Given name: {userInfo.given_name}</Text>
          <Text>Token: {this.state.data.token}</Text>
          <Button title={'Log Out!'} onPress={this.logout} />
        </View>
      );
    }
    return null;
  };

  render() {
    const userInfo = this.renderUserInfo();
    return (
      <View style={styles.container}>
        {
          !userInfo && !this.state.authReference &&
          <Button title={'Log In!'} onPress={this.login} />
        }
        {
          this.state.authReference && !this.state.data &&
          <ActivityIndicator size="large" color="#0000ff" />
        }
        {
          userInfo
        }
      </View>
    );
  }

  render2() {
    const userInfo = this.renderUserInfo();
    return (
      <div className="App">
        {
          !userInfo && !this.state.authReference &&
          <Button>
            <Image className="App-button"
                 src="https://www.bankid.com/en/_themes/bankid-www/img/logo1-default.svg"
                 alt="Log In"
                 onClick={this.login} />
          </Button>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
