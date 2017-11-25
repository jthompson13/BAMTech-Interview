// Defines
var selectedIcon = 0;
var numIcons = 0;
var iconSet = [];


// Build app context
var app = new PIXI.Application(window.screen.width, window.screen.height, {transparent: false});
document.body.appendChild(app.view);
app.renderer.autoResize = true;

// Set background image first so user knows something is happening
var background = PIXI.Sprite.fromImage('/images/ballpark.jpg');
background.width = window.screen.width;
background.height = window.screen.height;
app.stage.addChild(background);

// Line up window and allow some resizing
function resize() { 
    app.view.style.position = 'absolute'
    app.view.style.left = ((window.innerWidth - app.width) >> 1) + 'px';
    app.view.style.top = ((window.innerHeight - app.height) >> 1) + 'px';
} 
resize();
$(window).on("resize", function () {
    resize();
}).trigger("resize");

// Define a loader to fetch game data then init view
const loader = new PIXI.loaders.Loader();
loader.add('games', '/fetchGames'); 
loader.load((loader, resources) => {
   
   var data = JSON.parse(resources.games.data)
   gameData = JSON.parse(data); // data comming back as double nested string
   
   init(gameData);

});

// Place icons on screen
function init(gameData) {
    var xLoc = 250; // starting position (x axis) of icons
    var yLoc = app.renderer.height / 2
    numIcons = gameData.length;

    for(var i=0; i<numIcons; i++) {
        var texture = new PIXI.Texture.fromImage(gameData[i]._image);
        var icon = new PIXI.Sprite(texture);
        icon.anchor.set(0.5); // center icon

        var title = gameData[i]._homeTeam + " V. " + gameData[i]._awayTeam;

        // Set screen location
        icon.x = xLoc;
        icon.y = yLoc;
        
        // Small struct/object to keep pertinent information available. 
        var iSet = {
            img: icon,
            select: false,
            title: title,
            titleText: null,
            info: gameData[i]._venue,
            subTitleText: null
        }
        
        iconSet.push(iSet);

        app.stage.addChild(icon);

        xLoc += 250;
    }

    setSelectedIconText(0);
    selectedIcon = 0;
    onSelect(iconSet[0].img)
}

// Title and subtitle for icons
function setSelectedIconText(game) {
    // title
    var titleText = new PIXI.Text(iconSet[game].title, {
        fontSize: 25,
        fill: 'white', 
        align: 'center' 
    });
    titleText.anchor.set(.5)

    var p = iconSet[game].img.position.y - 65
    titleText.position.set(iconSet[game].img.position.x , p);

    // sub title
    var subTitleText = new PIXI.Text(iconSet[game].info, {
        fontSize: 17,
        fill: 'white', 
        align: 'center' 
    });
    subTitleText.anchor.set(.5);
    var p = iconSet[game].img.position.y + 65
    subTitleText.position.set(iconSet[game].img.position.x , p);

    iconSet[game].titleText = titleText;
    iconSet[game].subTitleText = subTitleText;

    app.stage.addChild(titleText, subTitleText);
}


function moveBack() {
    if(selectedIcon - 1 >= 0) {
        
        for(var i=0; i<10; i++) {
            shift(iconSet[i].img, +250);
        }

        updateSelect(selectedIcon, -1);
        setSelectedIconText(selectedIcon) // Note newly selected icon
    }
}

function moveForward() {
    if(selectedIcon + 1 < numIcons) {
        
        for(var i=0; i<10; i++) {
            shift(iconSet[i].img, -250);
        }

        updateSelect(selectedIcon, 1);
        setSelectedIconText(selectedIcon) // Note newly selected icon
    }
}

// Expand and highlight image
function onSelect(img) {
    img.scale.set(1.25);
    var outlineFilter = new PIXI.filters.GlowFilter(15, 3, 1, 0xfffff9, 0.5);
    img.filters = [outlineFilter];
}


function onDeselect(img) {
    img.scale.set(1);
    img.filters = null;
}

// Update icon select state and remove old screen text
function updateSelect(icon, direction) {
    onSelect(iconSet[icon+direction].img)
    iconSet[icon+direction].select = true;
    selectedIcon = icon+direction;
    onDeselect(iconSet[icon].img);
    iconSet[icon].select = false;
    
    app.stage.removeChild(iconSet[icon].titleText, iconSet[icon].subTitleText);
}

// Move Icon accross screen
function shift(img, distance) {
    img.setTransform(img.position.x + distance, img.position.y).updateTransform();
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