import React, { Component } from 'react';
import './home.css';
import {Link} from "react-router-dom";
import GameService from '../game/service';

class Home extends Component {

  state = {
    preMatch: false
  };

  componentDidMount() {
    let me = this;
    GameService.checkIsChallenge(isChallenge => {
      if (isChallenge) {
        me.setState({preMatch: true});
        me.setState({me : GameService.players.me, opponent: GameService.players.opponent});
        setTimeout(() => {
          me.props.history.push("/game");
        }, 3000);
      }
    });
  }

  getPreMatch() {
    let {me, opponent} = this.state;
    return (
      <div className="pre-match-content">
        <div className="pre-match-player-view current-player-view">
          <span className="current-name-player"></span>
          {me ?
            (
              <div className="pre-match-avatar">
              <img src="./images/btn-home-background.png"/>
              <img className="img-player-avatar current-player-avatar" src={me.photo}/>
              </div>
            ) :
            (
              <div className="pre-match-avatar">
                <img src="./images/btn-home-background.png"/>
              </div>
            )
          }

        </div>
        <div className="vs-text">vs</div>
        <div className="pre-match-player-view opponent-player-view">
          {
            opponent ? (
              <div className="pre-match-avatar">
                <img src="./images/btn-home-background.png"/>
                <img className="img-player-avatar opponent-player-avatar" src={opponent.photo}/>
              </div>
            ) :
            (
              <div className="pre-match-avatar">
                <img src="./images/btn-home-background.png"/>
              </div>
            )
          }
          <span className="opponent-name-player"></span>
        </div>
        {this.state.waiting ? 'WAITING .....' : 'READY '}
      </div>)
  }

  matchWithFriend() {
    this.setState({waiting: true, preMatch: true});
    let me = this;
    GameService.matchFriendPlayer(players => {
      me.setState({me: players[1].$1, opponent: players[0].$1});
      GameService.subscribePlayerReady(players.filter(player => player.getID !== FBInstant.player.getID())[0].getID(), () => {
        console.log('ready play!');
        me.setState({waiting: false});
        GameService.gameMode = 'VS';
        GameService.players = {me: players[1].$1, opponent: players[0].$1};
        setTimeout(() => {
         me.props.history.push("/game");
        }, 3000);
      });
    });
  }

  singlePlay() {
    GameService.gameMode = 'SOLO';
    this.props.history.push("/game");
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
                <button className="btn-home-center" id="btn-home-play" onClick={() => this.singlePlay()}>
                  <img src="./images/btn-home-play.png"/>
                </button>
                <button className="btn-home-center" id="btn-home-friend" onClick={() => this.matchWithFriend()}>
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
