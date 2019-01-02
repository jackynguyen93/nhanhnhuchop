import axios from 'axios'
// eslint-disable-next-line
import Gun from 'gun/gun'

class GameService {
  constructor() {
    this.apiQuestionUrl = "http://188.166.211.157";
    this.gun = Gun('https://gunjs.herokuapp.com/gun');
    this.bestScore = 0;
    this.gameMode = 'SOLO'; // SOLO or VS
    this.players = null;
  }

  getQuestion(level) {
    return axios.get(this.apiQuestionUrl + "/get-question", {params: {level}});
  }

  updateBestScore(score) {
    this.bestScore = score;
  }

  matchFriendPlayer(cb) {
    let me = this, matchPlayers = [];
    FBInstant.context.chooseAsync()
      .then(async () => {
  /*      let opponent = FBInstant.getEntryPointData();
        console.log(opponent);*/
        me.sendChallenge();
        console.log('context ' + FBInstant.context.getID());
        FBInstant.context.getPlayersAsync()
          .then(function(players) {
            cb(players);
            me.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).put({waiting: true});
          });
      })
      .catch(error => {
        throw 'Cannot play with this user, challenge status = ' + error
      });
  }

  subscribePlayerReady(playerID, onReady) {
    let startSubTime = new Date().getTime();

    this.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).get(playerID).on((valStr) => {
      let val = JSON.parse(valStr);
      if (val.isReady === true && val.time >= startSubTime) {
        onReady();
        this.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).put(null);
        this.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).get(playerID).off()
      }
    });
  }

  updateScoreVsMode(score) {
    console.log(this.players.me.id);
    this.gun.get("nhanhnhuchop-jackynguyen-v1").get('score').get(FBInstant.context.getID())
      .get(this.players.me.id).put(JSON.stringify({score: score, time: new Date().getTime()}));
  }

  subscribeOpponentScore(onFinish) {
    let startSubTime = new Date().getTime(), me = this;
    console.log('subscribing ' + this.players.opponent.id);
    this.gun.get("nhanhnhuchop-jackynguyen-v1").get('score').get(FBInstant.context.getID()).get(this.players.opponent.id).on((valStr) => {
      let val = JSON.parse(valStr);
      if (val.score != null && val.time >= startSubTime) {
        onFinish(val.score);
        me.gun.get("nhanhnhuchop-jackynguyen-v1").get('score').get(FBInstant.context.getID()).get(this.players.opponent.id).off()
      }
    });
  }

  checkIsChallenge(cb) {
    let opponent = FBInstant.getEntryPointData(), me = this;
    if (opponent && opponent.contextID === FBInstant.context.getID()) {
      let isExist = null;
      this.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).once(val =>{
        console.log("con", val);
          if (val != null) {
            me.gun.get("nhanhnhuchop-jackynguyen-v1").get(FBInstant.context.getID()).get(FBInstant.player.getID()).put(JSON.stringify({isReady: true, time: new Date().getTime()}));
            me.players = {
              me: {id: FBInstant.player.getID(), name: FBInstant.player.getName(), photo:  FBInstant.player.getPhoto()},
              opponent: {id: opponent.playerID, name: opponent.playerName, photo: opponent.avatar}};
            console.log(me.players);
            me.gameMode = "VS";
            cb(true);
          }
        }
      );
    } else {
      cb(false);
    }
  }

  sendChallenge() {
    convertBase64Image('./images/logo.png')
      .then(base64Picture => {
        console.log(base64Picture);
        const updateContent = {
          action: 'CUSTOM',
          cta: 'Got Challenge',
          image: base64Picture,
          text: {
            default: FBInstant.player.getName() + " đang thách đấu bạn"
          },
          template: 'challenge_mode',
          data: {
            contextID : FBInstant.context.getID(),
            playerID : FBInstant.player.getID(),
            playerName : FBInstant.player.getName(),
            avatar : FBInstant.player.getPhoto(),
            score : 0
          },
          strategy: 'IMMEDIATE_CLEAR',
          notification: 'PUSH'
        };
        console.log(updateContent);
        return FBInstant.updateAsync(updateContent)
      })
      .then(() => {

      })
  }
}


function convertBase64Image(imagePath) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', imagePath, true)
    xhr.responseType = 'blob'
    xhr.send()
    xhr.onload = event => resolve(xhr, event)
  })
    .then((xhr, event) => {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        var file = xhr.response
        reader.readAsDataURL(file)
        reader.onload = event => resolve(event)
      })
    })
    .then(event => event.target.result)
}


const gameService = new GameService();
export default gameService;
