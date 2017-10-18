// Enemies our player must avoid
//attributes of enemy object are set as follows whenever instantiated
var Enemy = function(xCoordinate,yCoordinate) {
    this.sprite = 'images/enemy-bug.png';
    this.positionX=xCoordinate;
    this.positionY=yCoordinate;
    this.velocityEnemy=90;
    if(this.positionY==145){
      this.velocityEnemy*=2;
    }else if(this.positionY==60){
      this.velocityEnemy*=3;
    }
};

// this function updates the location of the respective enemy (object) w.r.t. individual speed
Enemy.prototype.update = function(dt) {
    this.positionX+=(this.velocityEnemy*dt);
    if(this.positionX>500)
      this.positionX=-150;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

//here player is defined and its atttributes are assigned
var Player=function(xCoordinate,yCoordinate){
    this.sprite='images/char-boy.png';
    this.playerPosX=xCoordinate;
    this.playerPosY=yCoordinate;
    this.gamePoints=0;
    this.gameLives=4;
};

//this function updates the position of our player whenever it collides with enemy or obstacle(rock) or collects gem
Player.prototype.update = function(dt) {
  //these 3 sequential conditions reset player's position if there is collision with enemy
  if (this.playerPosY==220 && (this.playerPosX<(allEnemies[2].positionX+60) && (this.playerPosX+60)>allEnemies[2].positionX)) {
    this.resetPos();
  }else if (this.playerPosY==135 && (this.playerPosX<=(allEnemies[1].positionX+60) && (this.playerPosX+60)>=allEnemies[1].positionX)) {
    this.resetPos();
  }else if (this.playerPosY==50 && (this.playerPosX<=(allEnemies[0].positionX+60) && (this.playerPosX+60)>=allEnemies[0].positionX)) {
    this.resetPos();
  }

  //this condition updates score of player upon collecting gem and respawns gem at a random location
  if (this.playerPosY==gem.gemPosY && (this.playerPosX<=(gem.gemPosX+60) && (this.playerPosX+60)>=gem.gemPosX)){
    this.updateScore(25);
    this.gemRespawn();
    }

  //this condition updates score of player upon collision with obstacle and respawns obstacle at a random location
  if (this.playerPosY==obstacle.obstaclePosY && (this.playerPosX<=(obstacle.obstaclePosX+60) && (this.playerPosX+60)>=obstacle.obstaclePosX)){
      this.updateScore(-10);
      this.rockRespawn();
      }
};

//draws the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.playerPosX, this.playerPosY);
};

//this function updates player's score and checks if target score is reached
Player.prototype.updateScore=function(point) {
    var tempPoint=parseInt(point);
    this.gamePoints+=tempPoint;
    var screenScore=document.getElementById('scoreBoard');
    screenScore.innerHTML=this.gamePoints;
    if(this.gamePoints>=100){
      var ans=confirm("Congratulations !! You finished the game\nYour score is : "+this.gamePoints+"\nLives Remaining : "+this.gameLives+"\nDo you want to play again ?");
      if(ans){
        window.location.reload();
      }
    }
};

//this function resets position of player on collision with enemy
Player.prototype.resetPos=function() {
  this.playerPosX=202;
  this.playerPosY=390;
  this.gamePoints=0;
  this.gameLives-=1;
  var screenLives=document.getElementById('lifeCount');
  screenLives.innerHTML=this.gameLives;
  var scrScore=document.getElementById('scoreBoard');
  scrScore.innerHTML=this.gamePoints;
  if(this.gameLives==0){
      alert("Game Over !!! All lives used up.");
      window.location.reload();
  }
};

//this function changes the position of player as per the arrow key clicked
Player.prototype.handleInput=function(key) {
  if(key=='up'){
    if(this.playerPosY>=60) {
      this.playerPosY-=85;
    }
  }else if (key=='down') {
    if(this.playerPosY<=305) {
      this.playerPosY+=85;
    }
  }else if (key=='right') {
    if(this.playerPosX<=303){
     this.playerPosX+=101;
   }
  }else if (key=='left') {
    if(this.playerPosX>=101){
     this.playerPosX-=101;
   }
  }
};

//gem (item collected by player) is defined here
var Gem=function() {
  this.gemPosX=202;
  this.gemPosY=135;
  this.sprite='images/Gem Orange.jpg';
};

//this function draws the gem
Gem.prototype.render=function() {
  ctx.drawImage(Resources.get(this.sprite),this.gemPosX,this.gemPosY);
};

//this function changes location of gem after being collected once
Player.prototype.gemRespawn=function() {
  var arrayX=[0,101,202,303,404];
  var arrayY=[50,135,220];
  var indexX=Math.ceil(Math.random()*4);
  var indexY=Math.ceil(Math.random()*2);
  gem.gemPosX=arrayX[indexX];
  gem.gemPosY=arrayY[indexY];
};

//this function defines the obstacle
var Obstacle=function() {
  this.obstaclePosX=303;
  this.obstaclePosY=135;
  this.sprite='images/Rock.png';
};

//this function draws the obstacle
Obstacle.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite),this.obstaclePosX,this.obstaclePosY);
}

//this function changes location of obstacle after collision with player
Player.prototype.rockRespawn=function() {
  var arrX=[0,101,202,303,404];
  var arrY=[50,135,220];
  var indX=Math.ceil(Math.random()*4);
  var indY=Math.ceil(Math.random()*2);
  obstacle.obstaclePosX=arrX[indX];
  obstacle.obstaclePosY=arrY[indY];
};

//the objects needed are called here
var allEnemies=[new Enemy(0,60),new Enemy(0,145),new Enemy(0,230)];
var player=new Player(202,390);
var gem=new Gem();
var obstacle=new Obstacle();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

   player.handleInput(allowedKeys[e.keyCode]);
});
