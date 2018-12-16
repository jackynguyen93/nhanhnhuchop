import React, { Component } from 'react';
import './home.css';
import {Link} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="container home-screen">
        <img className="logo" src="./images/logonhanhnhuchop.png"/>
        <div className="home-main">
          <div className="btn-home-content">
            <Link to="/game" >
              <button className="btn-home-center" id="btn-home-play">
                <img src="./images/btn-home-play.png"/>
              </button>
            </Link>
            <button className="btn-home-center" id="btn-home-friend">
              <img src="./images/btn-home-friend.png"/>
            </button>
            <button className="btn-home-center" id="btn-home-time">
              <img src="./images/btn-home-time.png"/>
            </button>
          </div>
          <div className="home-bottom-bar">
            <button className="btn-home-bottom" id="btn-home-exit">
              <img src="./images/btn-home-exit.png"/>
            </button>
            <button className="btn-home-bottom" id="btn-home-leaderboard">
              <img src="./images/btn-home-leaderboard.png"/>
            </button>
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
        </div>
      </div>
    );
  }
}

export default Home;
