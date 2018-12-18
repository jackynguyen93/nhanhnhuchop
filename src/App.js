import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home/Home";
import Game from "./game/Game";
import './App.css'
import Leaderboard from "./leaderboard/Leaderboard";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/leaderboard" component={Leaderboard} />
        </Switch>
      </Router>
    );
  }
}

export default App;
