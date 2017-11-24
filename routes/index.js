var express = require('express');
var router = express.Router();
var GameIcon = require("../model/GameIcon");

var mlb_connection = require('../dal/connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fetchGames', function(req, res) {
  // Setting exact date for now.
  // Some dates have bad thumbnail links
  var date = new Date(2016, 5, 20);
  
  // ask dal to fetch data
  mlb_connection.getBored(date, function(err, rez) {
    if(err == null) {
      var gameCount = rez.data.games.game.length;
      var games = rez.data.games.game;
      var gameIcons = [];
      var homeTeam, awayTeam, venue, icon;

      // pull out needed info for view
      for(var i=0; i<gameCount; i++) {
        homeTeam = games[i].home_team_name;
        awayTeam = games[i].away_team_name;
        venue = games[i].venue;
        icon = games[i].video_thumbnails.thumbnail[0].content;
        

        var gIcon = new GameIcon(homeTeam, awayTeam, venue, icon);
        gameIcons.push(gIcon);
      }

      // double nesting string?
      return res.json(JSON.stringify(gameIcons));
    }
  });
}); 

module.exports = router;