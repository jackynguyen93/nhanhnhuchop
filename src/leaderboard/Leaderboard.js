import React, { Component } from 'react';
import './leaderboard.css';
import {Link} from "react-router-dom";
import LeaderboardService from './service'

class Leaderboard extends Component {

  state = {
    members: [],
    showLeaderboardWeek: false
  }

  componentDidMount() {
    let me = this;
    LeaderboardService.getLeaderboard((data) => {
      let list = [];
      data.forEach((item, index) => {
        list.push( {
          rank: item.getRank() ? item.getRank() : index + 1,
          icon: item.getPlayer().getPhoto(),
          name: item.getPlayer().getName(),
          score: item.getScore()
        })
      });
      me.setState({members: list});
    });
  }

  static renderRank(item) {
    var imageUrl = '';
    switch (item.rank) {
      case 1:
        imageUrl = './images/ic-lb-rank-1.png';
        break;
      case 2:
        imageUrl = './images/ic-lb-rank-2.png';
        break;
      case 3:
        imageUrl = './images/ic-lb-rank-3.png';
        break;
      default:
        imageUrl = './images/ic-lb-rank-background.png';
        break;
    }

    if (item.rank <= 3) {
      return (
        <img className="lb-rank-icon" src={imageUrl} />
      )
    } else {
      return (
        <div className="lb-rank-icon lb-rank-icon-background">
          <span className="lb-rank-number">
            {item.rank}
          </span>
        </div>
      )
    }
  }

  render() {
    let me = this;
    return (
      <div className="container leaderboard-screen">
        <Link to="/">
          <button className="btn-leaderboard btn-lb-back">
            <img id="btn-lb-back" src="./images/ic-back.png"/>
          </button>
        </Link>
        <span className="lb-title">Leaderboard</span>
        <div className="leaderboard-content">
          <div className="lb-shadow">
            <div className="lb-tabbar">
              <button
                onClick={() => this.setState({showLeaderboardWeek: false})}
                className={"btn-leaderboard btn-lb-tabar btn-lb-friend " + (!this.state.showLeaderboardWeek ? "btn-lb-select" : "btn-lb-unselect")}
                id="btn-lb-friend"
              >
                Friends
              </button>
              <button
                onClick={() => this.setState({showLeaderboardWeek: true})}
                className={"btn-leaderboard btn-lb-tabar btn-lb-week " + (this.state.showLeaderboardWeek ? "btn-lb-select" : "btn-lb-unselect")}
                id="btn-lb-week"
              >
                This week
              </button>
            </div>
            <div className="lb-background">
              <ul id="lb-table">

                {
                  this.state.members.map(item => (
                    <li className="lb-item">
                      <div className="lb-user">
                        {Leaderboard.renderRank(item)}
                        <img className="lb-user-icon" src={item.icon}/>
                        <span className="lb-user-name">
                      {item.name}
                    </span>
                      </div>
                      <div className="lb-score-view">
                    <span className="lb-score">
                      {item.score}
                    </span>
                        <img className="lb-score-star" src="./images/ic-star-score.png"/>
                      </div>
                    </li>
                  ))
                }

              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Leaderboard;
