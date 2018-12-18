import React, { Component } from 'react';
import './home.css';
import {Link} from "react-router-dom";
import GameService from '../game/service';

class Home extends Component {

  state = {
    preMatch: false
  };

  getPreMatch() {
    GameService.matchFriendPlayer();

    return (
      <div className="pre-match-content">
        <div className="pre-match-player-view current-player-view">
          <span className="current-name-player"></span>
          <div className="pre-match-avatar">
            <img src="./images/btn-home-background.png"/>
            <img className="img-player-avatar current-player-avatar" src={''}/>
          </div>
        </div>
        <div className="vs-text">vs</div>
        <div className="pre-match-player-view opponent-player-view">
          <div className="pre-match-avatar">
            <img src="./images/btn-home-background.png"/>
            <img className="img-player-avatar opponent-player-avatar"/>
          </div>
          <span className="opponent-name-player"></span>
        </div>
      </div>)
  }

  render() {
    return (
      <div className="container home-screen">
        <img className="logo" src="./images/logonhanhnhuchop.png"/>
        {
          this.state.preMatch ?
            this.getPreMatch()
            :
            (<div className="home-main">
              <div className="btn-home-content">
                <Link to="/game">
                  <button className="btn-home-center" id="btn-home-play">
                    <img src="./images/btn-home-play.png"/>
                  </button>
                </Link>
                <button className="btn-home-center" id="btn-home-friend" onClick={() => this.setState({preMatch: true})}>
                  <img src="./images/btn-home-friend.png"/>
                </button>
              </div>
              <div className="home-bottom-bar">
                <button className="btn-home-bottom" id="btn-home-exit">
                  <img src="./images/btn-home-exit.png"/>
                </button>
                <Link to="/leaderboard">
                  <button className="btn-home-bottom" id="btn-home-leaderboard">
                    <img src="./images/btn-home-leaderboard.png"/>
                  </button>
                </Link>
                <button className="btn-home-bottom" id="btn-home-help">
                  <img src="./images/btn-home-help.png"/>
                </button>
                <button className="btn-home-bottom" id="btn-home-sound" value="true">
                  <img id="img-home-sound" src="./images/btn-home-sound.png"/>
                </button>
                <button className="btn-home-bottom" id="btn-home-avatar">
                  <img src="./images/btn-home-background.png"/>
                  <img className="img-player-avatar"/>
                </button>
              </div>
            </div>)
        }
      </div>
    );
  }
}

export default Home;
