export class Bullet extends Phaser.Physics.Arcade.Sprite {

  speed: number;
  isPlayers: boolean;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "bullet");
    this.setActive(false);
  }

  fire(x: number, y: number, isPlayers: boolean) {
    Phaser.Physics.Arcade.Sprite.call(this, this.scene, 0, 0, isPlayers ? 'blue_bullet' : 'red_bullet');
    
    this.setScale(0.5, 0.5);

    this.isPlayers = isPlayers;

    this.speed = Phaser.Math.GetSpeed(isPlayers ? 700 : -300, 1);

    this.scene.physics.add.existing(this);

    this.body.height *= 0.5;
    this.body.width *= 0.5;

    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  }

  update(time: number, delta: number) {
    this.y -= this.speed * delta;

    if (this.y < -50 || this.y > 700) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}
