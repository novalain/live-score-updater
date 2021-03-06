'use strict';

angular.module('liveScoreUpdaterApp')
.service('fetchService', function() {
  function formatMatchStart_(dateString) {
    const matchDate = new Date(dateString);
    const currentDate = new Date();
    let result = "";
    if (matchDate.getDay() === currentDate.getDay()) {
      result = "Today";
    } else if (matchDate.getDay() - currentDate.getDate() === 1) {
      result = "Tomorrow";
    } else {
      let month = matchDate.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = matchDate.getDate();
      day = day < 10 ? "0" + day : day;
      let hours = matchDate.getHours();
      hours = hours < 10 ? "0" + hours : hours;
      let minutes = matchDate.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      result = month + "/" + day + " " + hours + ":" + minutes;
    }
    return result;
  }

  function parseGameData_(data) {
    console.log("raw data", data);
    const stopDate = new Date(data.RoundInfo.StopDate).getTime();
    let result = {stopDate};
    result.games = [];

    data.RoundInfo.Matches.forEach( (match, index) => {
      let data = {};
      data.id = index;
      data.homeTeam = match.HomeTeam;
      data.awayTeam = match.AwayTeam;
      data.score = match.Score;
      data.start = formatMatchStart_(match.MatchStart);
      data.sign = match.Sign;
      data.isFinished = match.IsFinished;
      data.date = match.MatchStart;
      result.games.push(data);
    })
    return result;
  }

  // TODO: implement for europatips and so on
  function fetchGame(gameUrl) {
    switch(gameUrl) {
      case 'stryk':
        return fetch(URL_STRYKTIPSET)
                  .then(result => result.json())
                  .then(data => parseGameData_(data))  

        break;
      case 'europa':
        return fetch(URL_EUROPATIPSET)
                  .then(result => result.json())
                  .then(data => parseGameData_(data))  
        break;
      case 'topp':
        return fetch(URL_TOPPTIPSET)
                  .then(result => result.json())
                  .then(data => parseGameData_(data))  
        break;
      default: console.warn('Wrong API call');
    }
  }

  return {
    fetchGame : fetchGame
  }
});

