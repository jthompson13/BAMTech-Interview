var method = GameIcon.prototype;

function GameIcon(homeTeam, awayTeam, venue, image) {
    this._homeTeam = homeTeam;
    this._awayTeam = awayTeam;
    this._venue = venue;
    this._image = image;
}

method.homeTeam = function() {
    return this._age;
};

method.awayTeam = function() {
    return this._awayTeam;
};

method.venue = function() {
    return this._venue;
};

method.image = function() {
    return this._image;
};

module.exports = GameIcon;