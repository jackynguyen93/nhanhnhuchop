import axios from 'axios'

class GameService {
  constructor() {
    this.apiQuestionUrl = "https://nguyenvan.site";
    this.apiMatchUrl = "https://fbmath.herokuapp.com";
    this.bestScore = 0;
  }

  getQuestion(level) {
    return axios.get(this.apiQuestionUrl + "/get-question", {params: {level}});
  }

  updateBestScore(score) {
    this.bestScore = score;
  }

  syncGamePlay() {
    let contextId = FBInstant.context.getID();
    let currentPlayer = {
      playerId: FBInstant.player.getID(),
      playerName: FBInstant.player.getName(),
      avatar: FBInstant.player.getPhoto(),
      bestScore: 0,
      score: 0,
    }
    console.log('current player', currentPlayer);
  }

  matchFriendPlayer() {
    let me = this;
    FBInstant.context.chooseAsync()
      .then(() => {
        me.syncGamePlay();
        let opponent = FBInstant.getEntryPointData();
      })
      .catch(error => {
        throw 'Cannot play with this user, challenge status = ' + error
      });
  }
}

const gameService = new GameService();
export default gameService;
