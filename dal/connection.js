const axios = require('axios');

const base = "http://gdx.mlb.com/components/game/mlb/";

// Returns json array of game data for a perticular day
exports.getBored = function(date, callback) {
    // build date url for json request
    var url = base + "year_" + date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();

    // place a zero infront of month/day if single digit
    if(mm > 9) {
        url += "/month_" + mm;
    } else {
        url += "/month_0" + mm;
    }

    if(dd > 9) {
        url += "/day_" + dd;
    } else {
        url += "/day_0" + dd;
    }

    url += "/master_scoreboard.json";

    // axios promise seperates err and result 
    // quick fix
    var err = null;
    var response = null;
    axios.get(url)
         .then(response => {
            callback(err, response.data);
         })
         .catch(err => {
             callback(err, response)
            console.log(err);
         });
}