export class Player extends Phaser.Physics.Arcade.Sprite {

  lives: number;
  maxLives: number;
  weaponLevel: number;
  maxWeaponLevel: number;
  isShieldOn: boolean;
  container: Phaser.GameObjects.Container;
  shield: Phaser.GameObjects.Sprite;
  fireForward: Phaser.GameObjects.Sprite;
  fireBackward: Phaser.GameObjects.Sprite;
  damages: Phaser.GameObjects.Sprite[];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'playership');
    this.scene = scene;

    Phaser.Physics.Arcade.Sprite.call(this, this.scene, 0, 0, 'playership');
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.depth = 10;
    this.container = this.scene.add.container(320, 500);

    this.shield = this.scene.add.sprite(0, 0, "shield").setScale(0.5, 0.5);
    this.container.add(this.shield);

    this.fireForward = this.scene.add.sprite(0, 30, "fire_forward").setVisible(false).setScale(2);
    this.container.add(this.fireForward);
    this.fireBackward = this.scene.add.sprite(0, 30, "fire_backward").setVisible(false).setScale(2);
    this.container.add(this.fireBackward);

    /*this.damages = [
      this.scene.add.sprite(0, 0, "damage_3").setVisible(false).setScale(0.5, 0.5),
      this.scene.add.sprite(0, 0, "damage_2").setVisible(false).setScale(0.5, 0.5),
      this.scene.add.sprite(0, 0, "damage_1").setVisible(false).setScale(0.5, 0.5),
      this.scene.add.sprite(0, 0, "playership").setVisible(true).setScale(0.5, 0.5)
    ];*/
    // this.container.add(this.damages);

    this.setPosition(320, 500);

    this.setScale(0.5, 0.5);

    this.body.height *= 0.5;
    this.body.width *= 0.5;

    this.body.collideWorldBounds = true;

    this.lives = 3;
    this.maxLives = 3;
    this.weaponLevel = 0;
    this.maxWeaponLevel = 2;

    this.isShieldOn = false;
  }

  update(time: number, delta: number) {
    this.container.x = this.x; this.container.y = this.y;

    this.body.velocity.x *= 1 - 0.002 * delta;
    this.body.velocity.y *= 1 - 0.002 * delta;

    this.shield.setVisible(this.isShieldOn);
  }

  goForward(stop: boolean) {
    if (stop) this.setAccelerationY(0);
    else this.setAccelerationY(-1200);

    this.fireForward.setVisible(!stop);
  }

  goBackward(stop: boolean) {
    if (stop) this.setAccelerationY(0);
    else this.setAccelerationY(500);

    this.fireBackward.setVisible(!stop);
  }

  steerLeft(stop: boolean) {
    if (stop) {
      this.setAccelerationX(0);
      this.container.setScale(1, 1);
      this.setScale(0.5, 0.5);
    }
    else {
      this.setAccelerationX(-800);
      this.container.setScale(0.9, 1);
      this.setScale(0.45, 0.5);
    }
  }

  steerRight(stop: boolean) {
    if (stop) {
      this.setAccelerationX(0);
      this.container.setScale(1, 1);
      this.setScale(0.5, 0.5);
    }
    else {
      this.setAccelerationX(800);
      this.container.setScale(0.9, 1);
      this.setScale(0.45, 0.5);
    }
  }

  firingSpeed(): number {
    switch (this.weaponLevel) {
      case 0: return 500;
      case 1: return 450;
      case 2: return 400;
    }
  }

  takeDamage() {
  //  this.damages[this.lives].setVisible(false);
    this.lives = Math.max(0, this.lives - 1);
   // this.damages[this.lives].setVisible(true);
  }

  heal() {
   // this.damages[this.lives].setVisible(false);
    this.lives = Math.min(this.maxLives, this.lives + 1);
   // this.damages[this.lives].setVisible(true);
  }

  setInvisible() {
    this.setActive(false).setVisible(false);
    this.container.setActive(false).setVisible(false);
  }
}
