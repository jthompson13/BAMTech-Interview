
// Defines
var selectedIcon = 0;
var numIcons = 0;
var thumbnailSet = [];

// Build app context
var app = new PIXI.Application(window.screen.width, window.screen.height, {transparent: false});
document.body.appendChild(app.view);
app.renderer.autoResize = true;
app.view.style.position = 'absolute'
app.view.style.left = ((window.innerWidth - app.width) >> 1) + 'px';
app.view.style.top = ((window.innerHeight - app.height) >> 1) + 'px';

// Set background image first so user knows something is happening
var background = PIXI.Sprite.fromImage('/images/ballpark.jpg');
background.width = window.screen.width;
background.height = window.screen.height;
app.stage.addChild(background);

// Define a loader to fetch game data then init view
const loader = new PIXI.loaders.Loader();
loader.add('games', '/fetchGames'); 
loader.load((loader, resources) => {
   
   var data = JSON.parse(resources.games.data)
   gameData = JSON.parse(data); // data comming back as double nested string
   
   init(gameData);

});

function init(gameData) {
    numIcons = gameData.length;

    var xPos = 200;
    var yPos = app.renderer.height / 2;
    var i = 0;

    for(i; i<numIcons; i++) {
        var thumb = new thumbnail(gameData[i]);
        thumb.showThumb(xPos, yPos, app);
        thumbnailSet.push(thumb);
        xPos += 250;
    }

    selectedIcon = 0;
    thumbnailSet[0].select(app);
}

function moveBack() {
    if(selectedIcon - 1 >= 0) {
        thumbnailSet[selectedIcon].deSelect(app);

        for(var thumb in thumbnailSet) {
            thumbnailSet[thumb].move(250);
        }

        selectedIcon--;
        
        thumbnailSet[selectedIcon].select(app);
    }
}

function moveForward() {
    if(selectedIcon + 1 < numIcons) {
        thumbnailSet[selectedIcon].deSelect(app);

        for(var thumb in thumbnailSet) {
            thumbnailSet[thumb].move(-250);
        }

        selectedIcon++;
        
        thumbnailSet[selectedIcon].select(app);
    }
}

// Line up window and allow some resizing
function resize() { 
    app.view.style.left = ((window.innerWidth - app.width) >> 1) + 'px';
    app.view.style.top = ((window.innerHeight - app.height) >> 1) + 'px';
} 

// Listen for key strokes
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        moveBack();
        break;

        case 39: // right
        moveForward();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$(window).on("resize", function () {
    resize();
}).trigger("resize");