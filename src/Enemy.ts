import { Bullet } from "./Bullet";

export class Enemy extends Phaser.Physics.Arcade.Sprite {

  speed_y: number;
  speed_x: number;
  time_bias: number;
  lasers: Phaser.Physics.Arcade.Group;
  laserCounter: number = 0;
  variant: number;
  playScene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "enemy");
    this.playScene = scene;
  }

  launch(x: number, y: number, variant: number, lasers: Phaser.Physics.Arcade.Group): Enemy {
    Phaser.Physics.Arcade.Sprite.call(this, this.scene, 0, 0, 'enemy_' + (variant + 1));
    
    this.speed_y = Phaser.Math.GetSpeed((variant + 1) * 35, 1);
    this.speed_x = Phaser.Math.GetSpeed((2.5 - variant) * 50, 1);

    this.time_bias = Phaser.Math.FloatBetween(0, 3.14);

    this.setScale(0.3, 0.3);

    this.scene.physics.add.existing(this);
    this.body.height *= 0.3;
    this.body.width *= 0.3;

    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.variant = variant;

    this.laserCounter = 0;
    this.lasers = lasers;

    return this;
  }

  update(time: number, delta: number) {
    this.y += this.speed_y * delta;
    this.x += this.speed_x * 10 * Math.sin(time * 0.001);

    if (this.y > Number(this.scene.game.config.height) + 50) {
      this.setActive(false);
      this.setVisible(false);
    }

    if((this.laserCounter > 2000 && this.variant == 0) || this.laserCounter > 5000 && this.variant == 1) {
      let b: Bullet = this.lasers.get() as Bullet;
      if (b) {
        this.playScene.sound.play('enemy_shoot');
        
        b.fire(this.x, this.y + 25, false);
      }      
      this.laserCounter = 0;
    }
    this.laserCounter += delta;
  }
}
