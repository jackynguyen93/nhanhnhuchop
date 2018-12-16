import axios from 'axios'

class GameService {
  constructor() {
    this.apiurl = "http://localhost:3001";
  }

  getQuestion(level) {
    return axios.get(this.apiurl + "/get-question", {params: {level}});
  }
}

export default GameService;
