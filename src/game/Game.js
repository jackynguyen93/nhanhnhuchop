import React, {Component} from 'react';
import GameService from './service';
import './game.css'
import {Link} from "react-router-dom";

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
    this.gameService.getQuestion(this.state.currentLevel).then(res => {
      this.setState({
        ...res.data
      })
    });
    this.timeBar.current.style.right =  "0px";
    this.scoreFill.current.style.height = "0px";
    this.countDown();
  }

  componentDidMount() {
    this.gameService = new GameService();
    this.gameService.getQuestion(this.state.currentLevel).then(res => {
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
    this.gameService.getQuestion(randLevel < 15 ? randLevel : 15).then(res => {
      this.setState({
        ...res.data
      })
    })
  }


  countDown(time = 100) {
    // set time out for per question
    const me = this;
    const width = parseInt(me.timeBar.current.offsetWidth);
    // distance = width / (second * 10)
    const distance = width / 600;
    let currentRight = 0;
    console.log("Start:" + new Date().getTime());
    me.countDownInterval = setInterval(function() {
      if (parseInt(me.timeBar.current.offsetWidth) === 0) {
        clearInterval(me.countDownInterval);
        me.setState({timeup : true})
        console.log("End:" + new Date().getTime());
        //const game = Game.currentGame()
        //handleGameOver(game)
        //updateTurnBestScore()
      }
      currentRight += distance;
      me.timeBar.current.style.right =  currentRight + "px";
    }, time) // time for per count down and change in view
  }


  popupGameover() {
    return (
    <div className="pop-up-container">
      <div className="pop-up-box">
        <div className="pop-up-content" id="game-over-popup">
          <img className="ribbon" src={this.state.highest ? "./images/ribbon-new-record.png" : "./images/ribbon-game-over.png"}/>
          <div className="score-result-view">
            <div className="score-result new-score-result">
              <span className="score-result-text" id="score-new-text">New</span>
              <span className="score-result-point" id="new-score">{this.state.highest}</span>
            </div>
            <div className="score-result best-score-result">
              <span className="score-result-text" id="score-best-text">Best</span>
              <span className="score-result-point" id="best-score">{this.state.highest}</span>
              {/*<span className="score-result-point" id="opponent-score">0</span>*/}
            </div>
            <div className="score-result pvf-challenge-view">
              <button className="btn-pop-up" id="btn-share-challenge">
                Challenge
              </button>
            </div>
          </div>
          <div className="pop-up-button-view">
            <Link to="/" >
              <button className="btn-pop-up" id="btn-pop-up-exit">
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

  render() {
    let {question, casea, caseb, casec, cased, highest, timeup} = this.state;
    return (
      <div className="container home-screen">
        {timeup && this.popupGameover()}
        <div ref={this.timeBar} className="time" id="time"></div>
        <div className="main-header">
          <button className="btn-main btn-back">
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
