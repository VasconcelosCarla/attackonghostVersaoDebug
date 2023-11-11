//declaração de variáveis globais
var ninja, ninjaIdle, ninjaRun, ninjaJump, ninjaDead;
var ground, groundImage, invisibleGround;
var backgroundImg;
var ghost, ghostImage, ghostGroup;
var shooting, shootingGroup;
var score = 0;
var ghostLive = 0;

/*Declaramos variáveis com letras MAIÚCULAS quando contém
valores constantes que não podem mudar dentro do programa*/
var WAIT = 1;
var PLAY = 2;
var END = 0;
var gameState = WAIT;
var soundJump, soundDead, soundForce, soundLaser;

var gameOver, restart, gameOverImg, restartImg;

function preload(){ //carregamento de animações, imagens e sons

  backgroundImg = loadImage("../assets/fundo.jpg")

  ninjaIdle = loadAnimation("../assets/Idle0.png", "../assets/Idle1.png", "../assets/Idle2.png", "../assets/Idle3.png", "../assets/Idle4.png", "../assets/Idle5.png", "../assets/Idle6.png", "../assets/Idle7.png", "../assets/Idle8.png", "../assets/Idle9.png");

  ninjaRun = loadAnimation("../assets/Run__000.png", "../assets/Run__001.png","../assets/Run__002.png", "../assets/Run__003.png","../assets/Run__004.png",
"../assets/Run__005.png", "../assets/Run__006.png", "../assets/Run__007.png", "../assets/Run__008.png", 
"../assets/Run__009.png");

 ninjaJump = loadAnimation("../assets/Jump__000.png", "../assets/Jump__001.png", "../assets/Jump__002.png", "../assets/Jump__003.png", "../assets/Jump__004.png", "../assets/Jump__005.png", "../assets/Jump__006.png", "../assets/Jump__007.png", "../assets/Jump__008.png", "../assets/Jump__009.png");

 ninjaDead = loadAnimation("../assets/Dead0.png", "../assets/Dead1.png","../assets/Dead2.png", "../assets/Dead3.png", "../assets/Dead4.png", "../assets/Dead5.png", "../assets/Dead6.png", "../assets/Dead7.png", "../assets/Dead8.png", "../assets/Dead9.png");

 groundImage = loadImage("../assets/groundGrande.png");

 ghostImage = loadAnimation("../assets/ghost0.png", "../assets/ghost1.png", "../assets/ghost3.png", "../assets/ghost4.png", "../assets/ghost5.png", "../assets/ghost6.png","../assets/ghost8.png", "../assets/ghost9.png", "../assets/ghost10.png")

 gameOverImg = loadImage("./assets/gameOver.png");
 restartImg = loadImage("./assets/reset.png");

 soundDead = loadSound("./assets/dead.mp3");
 soundForce = loadSound("./assets/The_Force.mp3");
 soundJump = loadSound("./assets/jump.mp3");
 soundLaser = loadSound("./assets/laser.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ground = createSprite(width/2,height - height*0.1,width, height*0.5 );
  ground.addImage("ground",groundImage);
  ground.scale = 0.28

  verticalGround = createSprite(0, 350, 20, 700);
  verticalGround.visible = false;
  
  ninja = createSprite(width/2 - width*0.4 , 0 , 20, 50);
  ninja.addAnimation("idle",ninjaIdle);
  ninja.addAnimation("running", ninjaRun);
  ninja.addAnimation("jumping", ninjaJump);
  ninja.addAnimation("deading", ninjaDead);
  ninja.scale = 0.28;
  frameRate(60);

  invisibleGround = createSprite(width/2, height - height*0.2, width, height*0.06);
  invisibleGround.visible = false;

  ghostGroup = new Group();
  shootingGroup = new Group();
  //ninja.debug = true; mostra o colisor
  //ground.debug = true;
  ninja.setCollider("rectangle", 30, 20, 170, 480); //arruma o colisor

  gameOver = createSprite(width/2, height/2 - 150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  restart = createSprite(width/2, height/2 + 50);
  restart.addImage(restartImg);
  restart.scale = 0.6;
  restart.visible = false;
}

function draw() {
  background(backgroundImg);


  if(keyDown("right")){
    gameState = PLAY;
    ninja.changeAnimation("running");
  }
  
  if(gameState === PLAY){
    //Som da música principal
    if(!soundForce.isPlaying()){
      soundForce.play();
    }
    spawGhosts();

    if(keyDown("space") && ninja.y >= height*0.2){
      console.log("o pulo é " + ninja.velocityY);
      console.log("A posição y da ninja é " + ninja.y);
      console.log("a altura do solo invisivel é " + invisibleGround.y);
      ninja.velocityY = -10;
      ninja.changeAnimation("jumping");
      //Som do pulo  
      if(!soundJump.isPlaying()){
        soundJump.play();
      }
    }

    if(ninja.isTouching(invisibleGround)){
      ninja.changeAnimation("running");
    }

    //ninja.frameDelay = -(4 + 3*score/100)
    ground.velocityX = -(4 + 3*score/100);
    //console.log(ground.x)
    if(ground.x < 0){
      ground.x = ground.width/8 
    }

    if(keyDown("left")){
      spawShooting();
      if(!soundLaser.isPlaying()){
        soundLaser.setVolume(0.25); //definindo o volume para 0.5 (metade do volume máximo);
        soundLaser.play();
      }
    }

    shootingGroup.overlap(ghostGroup, function(shooting, ghost) {
      shooting.remove();
      ghost.remove();
      //score++; 
      score = score + 5;
    });

    if(ghostGroup.isTouching(ninja)){
      gameState = END;
      if(!soundDead.isPlaying()){
        soundDead.play();
      }
    }

    ghostGroup.overlap(verticalGround, function(ghost){
      if(ghost.position.x <= -10){
        ghost.remove();
        ghostLive++;
      }
    })
    
    
  }

  if(gameState === END){

    

    ground.velocityX = 0;
    ninja.changeAnimation("deading");
    
    setTimeout(function(){
      ninja.animation.stop();
    }, 3000)
    ninja.animation.changeFrame(ninja.animation.getLastFrame());

    gameOver.visible = true;
    restart.visible = true;

  }
  console.log(gameState);
   
  if(mousePressedOver(restart)){
    reset();
  }
  
  //implementando a gravidade
  ninja.velocityY = ninja.velocityY + 0.8;
  
  

  
  
  
  ninja.collide(invisibleGround);
  drawSprites();
  fill("red");
  textSize(35);
  text("Dead ghosts: " + score, width - 400, height - 80);
  fill("white");
  text("Living ghosts: " + ghostLive, width - 400, height - 40);
  
  
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
}

function spawGhosts(){

  if(frameCount % 100 === 0){ // a cada 60 quadros ele desenha um fantasma
    ghost = createSprite(1440, 100, 40, 40);
    ghost.velocityX = -(6 + score/100);
    ghost.y = Math.round(random(100, 500));
    ghost.addAnimation("terror", ghostImage);
    ghost.scale = 0.2; 

    ghost.lifetime = 400;
    //tempodevida = distancia/velocidade 1400/4

    ghostGroup.add(ghost);
  }
}

function spawShooting(){
  
  if(frameCount % 5 ===0){
    shooting = createSprite(ninja.x, ninja.y, 8, 5);
    shooting.velocityX = 5;
    shooting.shapeColor = "black";
    shooting.lifetime = 150;

    shootingGroup.add(shooting);
  }

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
  ghostLive = 0;
  ninja.changeAnimation("running");
  ninja.animation.rewind();

}