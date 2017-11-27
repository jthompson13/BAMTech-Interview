/*
* This class is designed to create and control PIXI 
*   thumbnails. It requires PIXI.JS and a refference to
*   a PIXI cavas to work properly.
*/
function thumbnail(game) {
    ////// BEGIN PRIVATE VARIABLES //////
    this.game = game;
    var xLoc = 0;
    var yLoc = 0;
    var selected = false;
    var texture = null;
    var sprite = null;
    var pxTitle = null;
    var pxSubTitle = null;
    var glowFilter = null;
    ////// END PRIVATE VARIABLES //////

    ////// BEGIN PRIVATE FUNCTIONS //////

    // Return title
    var getTitle = function(){
        return game.homeTeam + " V. " + game.awayTeam;
    };

    // Return subtitle
    var getSubTitle = function() {
        return game.venue;
    };

    // Build PIXI texture
    var buildTexture = function() {
        texture = new PIXI.Texture.fromImage(game.image);
    };

    // Create PIXI sprite object
    var buildSprite = function() {
        if(texture === null ) return;
        sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5); // center icon
    };

    // Create Title as PIXI text object
    var buidTitle = function() {
        pxTitle = new PIXI.Text(getTitle(), {
            fontSize: 25,
            fill: 'white', 
            align: 'center' 
        });

        pxTitle.anchor.set(.5) // center
    };

    // Create Subtitle as PIXI text object
    var buildSubTitle = function() {
        pxSubTitle = new PIXI.Text(getSubTitle(), {
            fontSize: 17,
            fill: 'white', 
            align: 'center' 
        });
        
        pxSubTitle.anchor.set(.5) // center
    };

    // Add PIXI text objects to screen
    var showText = function(app) {
        // Only need to buil PIXI objects once
        if( pxTitle === null)
            buidTitle();
        if( pxSubTitle === null)
            buildSubTitle();

        pxTitle.position.set(xLoc , (yLoc - 65) );
        pxSubTitle.position.set(xLoc , (yLoc + 65) );
        app.stage.addChild(pxTitle, pxSubTitle);
    };

    // Remove PIXI text objects from canvas
    var hideText = function(app) {
        app.stage.removeChild(pxTitle, pxSubTitle);
    };

    ////// END PRIVATE FUNCTIONS //////

    
    ////// BEGIN PUBLIC FUNCTIONS //////

    // Moves thumbail across screen
    this.move = function(distance) {
        if(sprite === null) return;

        sprite.setTransform(sprite.position.x + distance, yLoc).updateTransform();

        xLoc = sprite.position.x;
    };

    // This will create a new PIXI sprite
    //  and display it
    this.showThumb = function(x, y, app) {
        xLoc = x;
        yLoc = y;

        if(texture === null) 
           buildTexture();
        if(sprite === null)
           buildSprite();

        sprite.x = xLoc;
        sprite.y = yLoc;

        app.stage.addChild(sprite);
    };

    // Increase Image by 125%, add glow,
    //  show title and subtitle
    this.select = function(app){
        if(selected) return;

        sprite.scale.set(1.25); 

        if(glowFilter === null) // only create the filter once
            glowFilter = new PIXI.filters.GlowFilter(15, 3, 1, 0xfffff9, 0.5);
        sprite.filters = [glowFilter];
        showText(app);
        selected = true;
    };

    // Rescale PIXI image, remove filters,
    //  remove text from screen
    this.deSelect = function(app) {
        if(!selected) return;
        sprite.scale.set(1);
        sprite.filters = null;
        hideText(app);
        selected = false;
    };

    ////// EMD PUBLIC FUNCTIONS //////
}