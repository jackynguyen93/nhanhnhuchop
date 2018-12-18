import GameService from '../game/service';

class LeaderboardService {
  constructor() {
    this.leaderboardEndpoint = "nhanhnhuchop_score";
  }

  updateBestScore(score) {
    let me = this;
    FBInstant.getLeaderboardAsync(this.leaderboardEndpoint)
      .then(leaderboard => {
        return leaderboard.setScoreAsync(score)
      })
      .then(() => me.getPlayerLeaderboard())
      .catch(error => console.error(error))
  }

  getPlayerLeaderboard() {
    FBInstant.getLeaderboardAsync(this.leaderboardEndpoint)
      .then(leaderboard => leaderboard.getPlayerEntryAsync())
      .then(entry => {
        console.log('Log Player Entry Async api')
        console.log(entry)
        GameService.updateBestScore(entry.getScore());
      })
      .catch(error => console.error(error))
  }

  getLeaderboard(cb) {
    FBInstant.getLeaderboardAsync(this.leaderboardEndpoint)
      .then(leaderboard => leaderboard.getEntriesAsync(7, 0))
      .then(entries => cb(entries)) // warning: need to be called from object
      .catch(error => console.error(error));
  }
}

const leaderboardService = new LeaderboardService();

export default leaderboardService;
