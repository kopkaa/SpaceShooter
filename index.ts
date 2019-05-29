// DEPENDENCIES
import 'phaser';

import { Boot } from "./src/Boot";
import { Menu } from "./src/Menu";
import { Play } from "./src/Play";
import { Score } from "./src/Score";

export var gameConfig = {
        type: Phaser.AUTO,
        width: 480,
        height: 640,
        backgroundColor: 0x000000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        },
        scene: [Boot, Menu,Play, Score],        
    };


var game = new Phaser.Game(gameConfig);
window.focus();