var method = GameIcon.prototype;

function GameIcon(homeTeam, awayTeam, venue, image) {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.venue = venue;
    this.image = image;
}

method.homeTeam = function() {
    return this.age;
};

method.awayTeam = function() {
    return this.awayTeam;
};

method.venue = function() {
    return this.venue;
};

method.image = function() {
    return this.image;
};

module.exports = GameIcon;