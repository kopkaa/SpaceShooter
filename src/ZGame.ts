import { Boot } from "./Boot";
import { Play } from "./Play";
import { Menu } from "./Menu";
import { Score } from "./Score";

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
        scene: [Boot, Menu, Play, Score],        
    };