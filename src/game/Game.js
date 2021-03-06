import React, {Component} from 'react';
import GameService from './service';
import './game.css'
import {Link} from "react-router-dom";
import LeaderboardService from "../leaderboard/service";

const resultMapAnswer = {1 : 'A',  2 : 'B', 3 : 'C', 4 : 'D'};

class Game extends Component {

  state = {
    currentLevel: 1,
    fillScore: 0,
    highest: 0
  }

  constructor(props) {
    super(props);
    this.answerA = React.createRef();
    this.answerB = React.createRef();
    this.answerC = React.createRef();
    this.answerD = React.createRef();
    this.scoreFill = React.createRef();
    this.timeBar = React.createRef();
  }

  resetGame() {
    this.setState({
      currentLevel: 1,
      fillScore: 0,
      highest: 0,
      timeup: false
    });
    GameService.getQuestion(this.state.currentLevel).then(res => {
      this.setState({
        ...res.data
      })
    });
    this.timeBar.current.style.right =  "0px";
    this.scoreFill.current.style.height = "0px";
    this.countDown();
  }

  componentDidMount() {
    if (GameService.gameMode === 'VS') {
      GameService.subscribeOpponentScore(score => this.setState({opponentScore: score}));
    } else {
      GameService.gameMode = 'SOLO';
    }
    GameService.getQuestion(this.state.currentLevel).then(res => {
      this.setState({
        ...res.data
      })
    });
    this.countDown();
  }

  giveAnswer(anwser) {
    this.setState({anwser: anwser});
    if (anwser !== resultMapAnswer[this.state.truecase]) {
      this['answer' + anwser].current.classList.add('wrong-answer');
      this.setState({currentLevel: 1, fillScore: 0});
      this.scoreFill.current.style.height = "0px";

    } else {
      if (this.state.currentLevel < 10) {

        this.setState({currentLevel: this.state.currentLevel + 1, fillScore: this.state.fillScore + 14});
        this.scoreFill.current.style.height = (this.state.fillScore + 14)  + "px";

        if (this.state.currentLevel > this.state.highest) {
          this.setState({highest: this.state.currentLevel});
        }
      } else {
        clearInterval(this.countDownInterval);
        this.setState({timeup : true});
      }
    }
    this['answer' + resultMapAnswer[this.state.truecase]].current.classList.add('animated');
    this['answer' + resultMapAnswer[this.state.truecase]].current.classList.add('flash');
    this['answer' + resultMapAnswer[this.state.truecase]].current.classList.add('correct-answer');
    setTimeout(() => {
      this.nextQuestion();
      this['answer' + anwser].current.classList.remove('wrong-answer');
      this['answer' + resultMapAnswer[this.state.truecase]].current.classList.remove('animated');
      this['answer' + resultMapAnswer[this.state.truecase]].current.classList.remove('flash');
      this['answer' + resultMapAnswer[this.state.truecase]].current.classList.remove('correct-answer');
    },2000);
  }

  nextQuestion() {
    let randLevel = this.state.currentLevel + parseInt(Math.random() * 10)  % 2;
    console.log(randLevel);
    GameService.getQuestion(randLevel < 15 ? randLevel : 15).then(res => {
      this.setState({
        ...res.data
      })
    })
  }

  countDown(time = 60) {
    // set time out for per question
    const me = this;
    const width = parseInt(me.timeBar.current.offsetWidth);
    // distance = width / (second * 10)
    const distance = width / (time * 10);
    let currentRight = 0;
    me.setState({timeLeft: time})
    console.log("Start:" + new Date().getTime());
    me.countDownInterval = setInterval(function() {
      if (parseInt(me.timeBar.current.offsetWidth) === 0) {
        me.handleGameover();
      }
      me.setState({timeLeft: me.state.timeLeft - 1})
      currentRight += distance;
      me.timeBar.current.style.right =  currentRight + "px";
    }, 100) // time for per count down and change in view
  }

  handleGameover() {
    clearInterval(this.countDownInterval);
    this.setState({timeup : true});
    if (GameService.gameMode === 'VS') {
      GameService.updateScoreVsMode(this.state.highest);
    }
    if (this.state.highest > GameService.bestScore) {
      this.setState({newRecord: true});
      LeaderboardService.updateBestScore(this.state.highest);
    }
  }

  quitGame() {
    this.setState({isQuit: true});
  }

  resumeGame() {
    this.setState({isQuit: false});
  }

  exit() {
    clearInterval(this.countDownInterval);
    GameService.isChallenge = null;
    GameService.gameMode = '';
    setTimeout(() => {
      this.props.history.push("/");
    }, 200);
  }

  getGameoverScore() {
    console.log(this.state.opponentScore);
    return GameService.gameMode === 'VS' ? (
      <div className="score-result-view">
        <div className="score-result new-score-result">
          <span className="score-result-text" id="score-new-text">Your score</span>
          <span className="score-result-point" id="new-score">{this.state.highest}</span>
        </div>
        <div className="score-result best-score-result">
          <span className="score-result-text" id="score-best-text">Opponent score</span>
          <span className="score-result-point" id="best-score">{this.state.opponentScore || 'Waiting ...'}</span>
        </div>
      </div>
    ) : (
      <div className="score-result-view">
        <div className="score-result new-score-result">
          <span className="score-result-text" id="score-new-text">Score</span>
          <span className="score-result-point" id="new-score">{this.state.highest}</span>
        </div>
        <div className="score-result best-score-result">
          <span className="score-result-text" id="score-best-text">Best</span>
          <span className="score-result-point" id="best-score">{GameService.bestScore}</span>
        </div>
        <div className="score-result pvf-challenge-view">
          <button className="btn-pop-up" id="btn-share-challenge">
            Challenge
          </button>
        </div>
      </div>
    )
  }

  popupGameover() {
    return (
    <div className="pop-up-container">
      <div className="pop-up-box">
        <div className="pop-up-content" id="game-over-popup">
          <img className="ribbon" src={this.state.newRecord ? "./images/ribbon-new-record.png" : "./images/ribbon-game-over.png"}/>
          {this.getGameoverScore()}
          <div className="pop-up-button-view">
            <Link to="/" >
              <button className="btn-pop-up" id="btn-pop-up-exit" >
                <img src="./images/btn-home-exit.png"/>
              </button>
            </Link>
            <button className="btn-pop-up" id="btn-pop-up-replay" onClick={() => this.resetGame()}>
              <img src="./images/btn-popup-replay.png"/>
            </button>
            <Link to="/" >
              <button className="btn-pop-up" id="btn-pop-up-go-home">
                <img src="./images/btn-popup-go-home.png"/>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    )
  }

  popupQuitGame() {
    return (
    <div className="pop-up-container">
      <div className="pop-up-box">
        <div className="pop-up-content" id="quit-game-popup">
          <span className="quit-game-title">Are you sure?</span>
          <div className="quit-game-view">

            <button className="btn-pop-up btn-quit-game" id="btn-quit-game" onClick={() => this.exit()}>
              <span className="btn-quit-title">Quit</span>
            </button>

            <button className="btn-pop-up btn-quit-game" id="btn-quit-game-back" onClick={() => this.resumeGame()}>
              <span className="btn-quit-title">Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    )
  }

  render() {
    let {question, casea, caseb, casec, cased, highest, timeup, isQuit} = this.state;
    return (
      <div className="container home-screen">
        {timeup && this.popupGameover()}
        {isQuit && this.popupQuitGame()}
        <div ref={this.timeBar} className="time" id="time"></div>
        <div className="main-header">
          <button className="btn-main btn-back" onClick={() => this.quitGame()}>
            <img id="btn-main-back" src="./images/ic-back.png"/>
          </button>
          <div className="highest-score-view">
            <span id="score">{highest}</span>
            <img className="star-score" src="./images/ic-star-score.png"/>
          </div>
          <div className="score-view">
            <img className="score-bar img-responsive" src="./images/score.png"/>
            <div  ref={this.scoreFill} className="score-bar-fill"/>
            <p className="score-number">{this.state.currentLevel - 1 }</p>
          </div>
        </div>
        <div className="main-container">
          <div className="question-view">
            {question}
          </div>
          <div className="operation-button-view">
            <div ref={this.answerA} className="btn-main btn-result" onClick={() => this.giveAnswer('A')}>
              {casea}
            </div>
            <div ref={this.answerB} className="btn-main btn-result" onClick={() => this.giveAnswer('B')}>
              {caseb}
            </div>
            <div ref={this.answerC} className="btn-main btn-result" onClick={() => this.giveAnswer('C')}>
              {casec}
            </div>
            <div ref={this.answerD} className="btn-main btn-result" onClick={() => this.giveAnswer('D')}>
              {cased}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
