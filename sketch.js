var gameState= "play";
var score  = 0;
var life = 3 ;

function preload() {
    bgImg = loadImage('images/background.png');
    manImg = loadAnimation('images/man1.png','images/man2.png','images/man3.png','images/man4.png','images/man5.png','images/man6.png');
    manDeadImg = loadAnimation('images/d1.png','images/d2.png','images/d3.png','images/d4.png','images/d5.png','images/d6.png','images/d7.png');
    virusImg = loadAnimation('images/virus.png');
    virusDImg = loadAnimation('images/dead.png');
    platform1 = loadImage('images/pl1.jpg');
    platform2 = loadImage('images/pl2.jpg');
    sanitizerImg = loadImage('images/drop.png');
    restartImg = loadImage('images/restart.png');
    gameOverImg = loadImage("images/gameOver.png");
    playImg = loadImage("images/play.png");

    jumpingsound = loadSound("sounds/jumpingsound.wav");
    shotsound = loadSound("sounds/shootingsound.mp3");
    gamekhatam = loadSound("sounds/gameover.mp3");

}



function setup() {
    createCanvas(windowWidth, windowHeight);

    bg = createSprite(0,0, windowWidth, windowHeight);
    bg.addImage(bgImg);
    bg.scale=3;

    invisibleGround = createSprite(width/2, height-50, width, 20);
    invisibleGround.visible = false;
    invisibleGround.velocityX = -5;
    invisibleGround.scale=2.92;
 
    man = createSprite(180, height-180, 20,100)
    man.addAnimation("run",manImg);
    man.addAnimation("die",manDeadImg);
    //man.scale=0.5;
    
    play = createSprite(width/2, height/2);
    play.scale = 0.5;
    play.addImage(playImg);
    gameOver = createSprite(width/2, height/2-150);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    restart = createSprite(width/2, height/2+120);
    restart.addImage(restartImg);
    restart.scale = 1;
    play.visible = false;
    gameOver.visible = false;
    restart.visible = false;

   virusGroup = new Group();
   platformsGroup = new Group();
   dropsGroup = new Group();
   newVirusGroup = new Group();
   runningVirusGroup = new Group();
}

function draw(){
    background("#EFA588");
    drawSprites();

    fill("Black")
    textSize(30);
    text("Score: " + score, camera.position.x+400, 40);
    text("Life: " + life, camera.position.x-600, 40);


    if(gameState === "play") {

        if(life <= 3) {

        bg.velocityX = -5;

        if(bg.x < 800){ 
            bg.x = width/2;  
        }

        man.x = camera.position.x - 400;

        if(man.y > height+100) {
            man.y = invisibleGround.y;
        }
        
        if(keyDown("up")) {
            man.velocityY += -2;
            man.velocityY = -11;
            jumpingsound.play();
        }
        

        if(keyWentDown("space")) {
            sanitizerDrop=createSprite(man.x+90,man.y-35,10,10);
            sanitizerDrop.scale = 0.2;
            sanitizerDrop.velocityX=10;
            sanitizerDrop.addImage(sanitizerImg);
            dropsGroup.add(sanitizerDrop);
            shotsound.play();
        }

        man.velocityY += 0.9;
        man.collide(invisibleGround);

        if(invisibleGround.x < 200){ 
            invisibleGround.x = width/2+100;
        }

        runningViruss();
        spawnVirus();
        
        virusGroup.collide(platformsGroup);
        man.collide(platformsGroup);

        if(runningVirusGroup.isTouching(dropsGroup)){
            runningVirusGroup.destroyEach();
            score += 5;    
        }

        if(virusGroup.isTouching(dropsGroup)){
            score += 10;
            var Zx = virusGroup[0].x;
            var Zy = virusGroup[0].y;
            virusGroup.removeSprites();

            var newVirus = createSprite(Zx,Zy+30,30,100);
            newVirus.addAnimation("dead",virusDImg);
            newVirus.scale = 0.3;
            newVirus.velocityX = -5;
            newVirus.lifetime = 400 ;
            newVirusGroup.add(newVirus);
        }

        if(virusGroup.isTouching(man) || runningVirusGroup.isTouching(man) ){
            life -= 1;
            man.y = invisibleGround.y-30;
            man.velocityX=0;
            man.velocityY=0;
            man.scale = 0.8;
            man.changeAnimation("die",manDeadImg);
            gameState= "end";
        }
    }
}
    
if(gameState === "end") {
    bg.velocityX=0;
    virusGroup.setVelocityXEach(0);
    platformsGroup.setVelocityXEach(0);
    virusGroup.setLifetimeEach(0);
    newVirusGroup.setLifetimeEach(0);
    platformsGroup.setLifetimeEach(-1);
    gameOver.visible = true;
    gameOver.depth = 100;
    gamekhatam.play();
    
        
    if(life !== 0) {
        play.visible=true;
        if(mousePressedOver(play)) {
            man.changeAnimation("run", manImg);
            virusGroup.destroyEach();
            runningVirusGroup.destroyEach();
            newVirusGroup.destroyEach();
            platformsGroup.destroyEach();
            gameState = "play";
            play.visible = false;
            gameOver.visible=false;
            play.depth = 101;
        }
    } 
    else{
        restart.visible = true;
        restart.depth = 101;
        if(mousePressedOver(restart)){
            location.reload();
        }
    } 
            
}
}

function runningViruss() {
    if(frameCount % 100 === 0) {
        runningVirus = createSprite(width-200, height-180, 20,100);
        runningVirus.addAnimation("attack",virusImg);
        runningVirus.velocityX = -10;
        runningVirus.scale=0.3;
        runningVirusGroup.add(runningVirus);
    }
}

function spawnVirus() {
    if(frameCount % 200 === 0) {
        var zY;
        var y = Math.round(random(150,400))
        platform = createSprite(width, y, 80, 30);
        platform.velocityX = -5;
        var rand = Math.round(random(1,2));
        if(rand === 1) {
            zY = 90;
            platform.addImage(platform1);
            platform.scale=0.8;
        }
        if(rand === 2) {
            zY = 125;
            platform.addImage(platform2)
            platform.scale=0.8;
       
        }
        platform.lifetime = 400;
        platformsGroup.add(platform);
        
        viruss=createSprite(width, y-zY, 50, 100);
        viruss.addAnimation("attack",virusImg);
        viruss.velocityX = platform.velocityX; 
        viruss.scale=0.3;
        viruss.lifetime = 400;
        virusGroup.add(viruss);
    }
}