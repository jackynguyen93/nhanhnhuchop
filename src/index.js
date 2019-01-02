import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LeaderboardService from './leaderboard/service'
import GameService from './game/service'

FBInstant.initializeAsync().then(function() {
  FBInstant.setLoadingProgress(100);
  FBInstant.startGameAsync().then(function() {
    ReactDOM.render(<App />, document.getElementById('root'));
    LeaderboardService.getPlayerLeaderboard();
    console.log('ready');
  })
});
//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
