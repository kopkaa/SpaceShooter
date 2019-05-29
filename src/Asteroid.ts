export class Asteroid extends Phaser.Physics.Arcade.Sprite {

  speed_y: number;
  speed_x: number;
  rotationSpeed: number;
  size: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "asteroid");
  }

  launch(x: number, y: number, size: number): Asteroid {
    Phaser.Physics.Arcade.Sprite.call(this, this.scene, 0, 0, 'meteor_' + (size + 1));
    this.speed_y = Phaser.Math.GetSpeed(50, 1);
    this.speed_x = Phaser.Math.GetSpeed(size * Phaser.Math.Between(-15, 15), 1);
    this.rotationSpeed = Phaser.Math.FloatBetween(-0.5, 0.5)
    this.size = size;

    this.setScale(1, 1);

    this.scene.physics.add.existing(this);

    this.setAcceleration(0, 0);
    this.setVelocity(0, 0);

    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);

    return this;
  }

  update(time: number, delta: number) {

    this.y += this.speed_y * delta;
    this.x += this.speed_x * delta;
    this.angle += this.rotationSpeed * delta;

    if (this.y > Number(this.scene.game.config.height) + 50) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
