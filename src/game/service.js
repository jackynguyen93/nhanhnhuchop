import axios from 'axios'

class GameService {
  constructor() {
    this.apiurl = "https://nguyenvan.site";
  }

  getQuestion(level) {
    return axios.get(this.apiurl + "/get-question", {params: {level}});
  }
}

export default GameService;
