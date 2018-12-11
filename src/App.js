import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home/Home";
import Game from "./game/Game";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/game" component={Game} />
        </Switch>
      </Router>
    );
  }
}

export default App;
