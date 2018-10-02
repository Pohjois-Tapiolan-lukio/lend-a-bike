import React, { Component } from 'react';

import Titlebar from './Titlebar';
import { Lend } from './Lend/';
import { Provider } from './DataContext';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminToken: 'testtoken',
      bikes: [],
      lendings: [],
      breakdowns: [],
      bikeViewIndex: 0,
    };
  }
  componentDidMount() {
    this.reloadBikes();
    this.reloadLendings();
    this.reloadBreakdowns();
  }

  setToken = adminToken => this.setState({ adminToken });
  changeBikeViewIndex = index => {
    this.reloadLendings();
    this.reloadBikes();
    this.setState({ bikeViewIndex: index });
  };
  reloadBikes = () => {
    return fetch('/api/bikes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(result => {
        this.setState({
          bikes: result,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  reloadLendings = () => {
    return fetch('/api/lendings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(result => {
        this.setState({
          lendings: result,
        });
      })
      .catch(error => console.log);
  };
  reloadBreakdowns = () => {
    return fetch('/api/breakdowns', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          breakdowns: response,
        });
      });
  };
  render() {
    return (
      <Provider
        value={{
          ...this.state,
          setToken: this.setToken,
          reloadBikes: this.reloadBikes,
          reloadLendings: this.reloadLendings,
          changeBikeViewIndex: this.changeBikeViewIndex,
          reloadBreakdowns: this.reloadBreakdowns,
        }}
      >
        <Titlebar />
        <Lend />
      </Provider>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
