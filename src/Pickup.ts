import { Player } from "./Player";

export abstract class Pickup extends Phaser.Physics.Arcade.Sprite {
  time_bias: number;
  size: number;

  constructor(scene: Phaser.Scene, spriteName: string) {
    super(scene, 0, 0, "pickup");
    Phaser.Physics.Arcade.Sprite.call(this, this.scene, 0, 0, spriteName);
    this.scene.add.existing(this);

    this.time_bias = Phaser.Math.FloatBetween(0, 3.14);

    this.size = 0.8;
    this.setScale(0.8, 0.8);

    this.scene.physics.add.existing(this);

    this.body.height *= 0.8;
    this.body.width *= 0.8;

    this.setActive(false);
    this.setVisible(false);
  }

  launch(x: number, y: number): Pickup {
    this.setPosition(x, y);
    this.body.reset(this.x, this.y);

    this.setActive(true);
    this.setVisible(true);

    return this;
  }

  abstract effect(player: Player);

  update(time: number, delta: number) {
    let scale: number = Math.sin((time + this.time_bias)*0.005);
    this.setScale(this.size + 0.1*scale, this.size + 0.1*scale);
  }
}

export class HeartPickup extends Pickup {
  constructor(scene: Phaser.Scene) {
    super(scene, 'heart_powerup');
    this.setScale(0.03,0.03);
  }

  effect(player: Player) {
    player.heal();
  }
}

export class WeaponPickup extends Pickup {
  constructor(scene: Phaser.Scene) {
    super(scene, 'weapon_powerup');
  }

  effect(player: Player) {
    player.weaponLevel = Math.min(player.weaponLevel + 1, player.maxWeaponLevel);
  }
}

export class ShieldPickup extends Pickup {
  constructor(scene: Phaser.Scene) {
    super(scene, 'shield_powerup');
  }

  effect(player: Player) {
    player.isShieldOn = true;
  }
}