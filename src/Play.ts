import { Player } from "./Player";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";
import { Asteroid } from "./Asteroid";
import { Pickup, HeartPickup, WeaponPickup, ShieldPickup } from "./Pickup";

export class Play extends Phaser.Scene {

  player: Player;

  moveKeys: { [key: string]: Phaser.Input.Keyboard.Key };

  lasers: Phaser.Physics.Arcade.Group;
  enemies: Phaser.Physics.Arcade.Group;
  asteroids: Phaser.Physics.Arcade.Group;
  pickups: Phaser.Physics.Arcade.Group;
  music: Phaser.Sound.BaseSound;

  healthUiSprites: Phaser.Physics.Arcade.Sprite[];

  lastEnemySpawn: number = 0;
  lastAsteroidSpawn: number = 0;
  asteroidCounter: number;

  score: number = 0;
  scoreText: Phaser.GameObjects.Text;


  constructor() {
    super("Play");
  }

  create() {

    console.log("Play.create()");

    var soundConf = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    }

    this.music = this.sound.add('soundtrack',soundConf);

    this.music.play();

    this.player = new Player(this);

    this.moveKeys = <{ [key: string]: Phaser.Input.Keyboard.Key }>this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'fire': Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Enables movement 
    this.input.keyboard.on('keydown_W', function (event: object) {
      this.scene.player.goForward(false);
    });
    this.input.keyboard.on('keydown_S', function (event: object) {
      this.scene.player.goBackward(false);
    });
    this.input.keyboard.on('keydown_A', function (event: object) {
      this.scene.player.steerLeft(false);
    });
    this.input.keyboard.on('keydown_D', function (event: object) {
      this.scene.player.steerRight(false);
    });

    // Stops acceleration
    this.input.keyboard.on('keyup_W', function (event: object) {
      if (this.scene.moveKeys['down'].isUp)
        this.scene.player.goForward(true);
    });
    this.input.keyboard.on('keyup_S', function (event: object) {
      if (this.scene.moveKeys['up'].isUp)
        this.scene.player.goBackward(true);
    });
    this.input.keyboard.on('keyup_A', function (event: object) {
      if (this.scene.moveKeys['right'].isUp)
        this.scene.player.steerLeft(true);
    });
    this.input.keyboard.on('keyup_D', function (event: object) {
      if (this.scene.moveKeys['left'].isUp)
        this.scene.player.steerRight(true);
    });

    this.asteroidCounter = 0;

    // BULLET GROUP
    this.lasers = this.physics.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: true
    });

    // ENEMY GROUP
    this.enemies = this.physics.add.group({
      classType: Enemy,
      maxSize: 50,
      runChildUpdate: true
    });

    // ASTEROID GROUP
    this.asteroids = this.physics.add.group({
      classType: Asteroid,
      maxSize: 100,
      runChildUpdate: true
    })

    // PICKUP GROUP
    this.pickups = this.physics.add.group(
      [
        new HeartPickup(this), new WeaponPickup(this), new ShieldPickup(this),
        new HeartPickup(this), new WeaponPickup(this), new ShieldPickup(this),
        new HeartPickup(this), new WeaponPickup(this), new ShieldPickup(this)
      ], {
        classType: Pickup,
        maxSize: 18,
        runChildUpdate: true
      })

    // LASERS kill ENEMIES
    this.physics.add.overlap(this.lasers, this.enemies, this.collideLaserEnemy, null, this);
    // LASERS kill ASTEROIDS
    this.physics.add.overlap(this.lasers, this.asteroids, this.collideLaserAsteroid, null, this);
    // LASERS kill PLAYER
    this.physics.add.overlap(this.player, this.lasers, this.collideLaserPlayer, null, this);

    // PLAYER is killed by ENEMIES
    this.physics.add.overlap(this.player, this.enemies, this.collidePlayerSprite, null, this);
    this.physics.add.overlap(this.player, this.asteroids, this.collidePlayerSprite, null, this);
    this.physics.add.overlap(this.player, this.pickups, this.collidePlayerPickup, null, this);

    // SCORE TEXT
    this.score = 0;
    this.scoreText = this.add.text(5, 5, "Score: 0", { fontFamily: "Arial Black", fontSize: 12, color: "#33ff33", align: 'left' }).setStroke('#333333', 1);

    // HEALTH SPRITES
    this.healthUiSprites = [];
    for (let i: number = 0; i < this.player.maxLives + 1; i++) {
      this.healthUiSprites[i] = this.physics.add.sprite(15 + i * 22, 32, "life").setScale(0.03, 0.03);
    }
  }

  update(time: number, delta: number) {

    this.player.update(time, delta);
    this.updateHealthUI();

    // player shooting
    if (this.input.keyboard.checkDown(this.moveKeys['fire'], this.player.firingSpeed())) {
      this.sound.play('player_shoot');

      if (this.player.weaponLevel != 1) {
        let b1: Bullet = this.lasers.get() as Bullet;
        if (b1) {
          console.log(this.player.weaponLevel);
          b1.fire(this.player.x, this.player.y - 25, true);
        }
      }

      if (this.player.weaponLevel != 0) {
        let b2: Bullet = this.lasers.get() as Bullet;
        if (b2) {
          b2.fire(this.player.x - 23, this.player.y - 15, true);
        }

        let b3: Bullet = this.lasers.get() as Bullet;
        if (b3) {
          b3.fire(this.player.x + 23, this.player.y - 15, true);
        }
      }
    }

    this.lastEnemySpawn -= delta;
    if (this.lastEnemySpawn < 0) {
      // SPAWN ENEMY
      let e: Enemy = this.enemies.get() as Enemy;
      if (e) {
        e.launch(Phaser.Math.Between(50, 400), -50, Phaser.Math.Between(0, 2), this.lasers);
      }
      this.lastEnemySpawn += 1000 / Math.log(this.score/10.0 + 2);
    }

    this.lastAsteroidSpawn -= delta;
    if (this.lastAsteroidSpawn < 0) {
      // SPAWN ASTEROID
      let a: Asteroid = this.asteroids.get() as Asteroid;
      if (a) {

        a.launch(Phaser.Math.Between(50, 400), -50, 0);
        
      }
      this.lastAsteroidSpawn += 5000 / Math.log(this.score/10.0 + 2);
    }
  }

  updateHealthUI() {
    for (var i = 0; i < this.player.lives + 1; i++) {
      this.healthUiSprites[i].setVisible(true);
    }
    for (var i = this.player.lives + 1; i < this.healthUiSprites.length; i++) {
      this.healthUiSprites[i].setVisible(false);
    }
  }

  collideLaserEnemy(laser: Bullet, enemy: Enemy) {
    if (!laser.active || !laser.isPlayers) return;
    if (!enemy.active) return;

    laser.setActive(false).setVisible(false);
    enemy.setActive(false).setVisible(false);

    var particles_1 = this.add.particles('explosion_1');

    var emitter_1 = particles_1.createEmitter({
      speedX: {min: -100, max: 100},
      speedY: {min: -100, max: 100},
      scale: {start: 0.2, end: 0.7},
      alpha: {min: 0.2, max: 0.8},
      lifespan: {min: 150, max: 400},
    });    
    emitter_1.explode(20, enemy.x, enemy.y);

    var particles_2 = this.add.particles('explosion_2');
    var emitter_2 = particles_2.createEmitter({
      speedX: {min: -50, max: 50},
      speedY: {min: -50, max: 50},
      scale: {start: 0.2, end: 0.4},
      alpha: {min: 0.2, max: 0.6},
      lifespan: {min: 50, max: 200},
    });    
    emitter_2.explode(20, enemy.x, enemy.y);

    this.score += 3;
    this.scoreText.text = "Score: " + this.score;
  }

  collideLaserPlayer(player: Player, laser: Bullet) {
    if (!laser.active || laser.isPlayers) return;

    laser.setActive(false).setVisible(false);
    this.collidePlayer(player);
  }

  collideLaserAsteroid(laser: Bullet, asteroid: Asteroid) {
    if (!laser.active || !laser.isPlayers) return;
    if (!asteroid.active) return;

    laser.setAcceleration(0, 0);
    laser.setActive(false).setVisible(false);

    var size = 5*(3-asteroid.size)

    if (asteroid.size < 2) {

      for (var i = 0; i < 2; i++) {

        let a: Asteroid = this.asteroids.get() as Asteroid;


        if (a) {

          a.launch(asteroid.x + Phaser.Math.Between(-size, size), asteroid.y + Phaser.Math.Between(-size, size), asteroid.size + 1);

        }


      }
    }
    if ((asteroid.size == 2 && Phaser.Math.Between(0, 1) == 0) ) {

      var pickup = this.pickups.getFirstNth(Phaser.Math.Between(0, 3))
      if (pickup) pickup.launch(asteroid.x, asteroid.y)
        
    }

    var particles = this.add.particles('meteor_3');
    var emitter = particles.createEmitter({
      speedX: {min: -size*6, max: size*6},
      speedY: {min: -size*6, max: size*6},
      scale: {start: size/15.0, end: size/20.0},
      alpha: {min: 0.2, max: 0.5},
      lifespan: {min: 150, max: 400},
    });    
    emitter.explode(10, asteroid.x, asteroid.y);

    this.asteroidCounter++;
    asteroid.setActive(false).setVisible(false);
  }

  collidePlayerSprite(player: Player, enemy: Phaser.Physics.Arcade.Sprite) {
    if (!player.active) return;
    if (!enemy.active) return;

    enemy.setActive(false).setVisible(false);
    this.collidePlayer(player);
  }

  collidePlayerPickup(player: Player, pickup: Pickup) {
    if (!player.active) return;
    if (!pickup.active) return;

    pickup.effect(player);
    pickup.setActive(false).setVisible(false);
  }

  collidePlayer(player: Player) {
     this.cameras.main.shake(300);
   
    if (player.isShieldOn) player.isShieldOn = false;
    else if (player.lives > 0) player.takeDamage();

    else {
      console.log("dead");
      player.setInvisible();
      this.time.delayedCall(500, this.gameOver, [], this);
    }
  }

  gameOver() {
      
    this.music.stop();
    this.scene.pause();


    let style = { font: "bold 25px Georgia", fill: "#FE0000", boundsAlignH: "center", boundsAlignV: "middle" };   
    let styleScore = { font: "15px Arial", fill: "#5485f7", boundsAlignH: "center", boundsAlignV: "middle" }; 
        
    this.add.text(this.cameras.main.centerX -70 , this.cameras.main.centerY, 'Game Over :(', style);
    this.add.text(this.cameras.main.centerX -30 , this.cameras.main.centerY + 50, 'Score: ' + this.score, styleScore);
  

    let username = prompt("Enter your nick");
    let date = new Date();

    var info = {
      username: username,
      score : this.score
    }

    info = JSON.stringify(info);

    localStorage.setItem(date,info);


  }
}