

export class Menu extends Phaser.Scene {




  constructor() {
    super("Menu");
  }

  preload(){
    this.load.image('menu_bg', "./assets/menu/bg.png")
  }

  create() {

    console.log("MENU");

    this.add.image(0,0,'menu_bg').setOrigin(0);


    this.createButtons();

  }

  update() {
  
  }


 createButtons(){
       
      let y = 200;
      let style = { font: "bold 25px Georgia", fill: "#1b2fc6", boundsAlignH: "center", boundsAlignV: "middle" };
        
          
       const startButton = this.add.text(160, y, 'New Game', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(startButton) )
      .on('pointerout', () => this.enterButtonRestState(startButton) )
      .on('pointerdown', () => this.startNewGame() );
      
      y += 100;
      
       const highScoreButton = this.add.text(160, y, 'High Score', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(highScoreButton) )
      .on('pointerout', () => this.enterButtonRestState(highScoreButton) )
      .on('pointerdown', () => this.showHighScore() );
      
       y += 100;
       
      
       const exitButton = this.add.text(200, y, 'Exit ', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(exitButton) )
      .on('pointerout', () => this.enterButtonRestState(exitButton) )
      
      
    } 
    
    
    enterButtonHoverState(button){
        button.setStyle({ fill: '#4b5de5'});
    }
    
    enterButtonRestState(button) {
        button.setStyle({ fill: '#1b2fc6' });
  }
  
  startNewGame(){
      console.log("new game")
      this.scene.switch('Play');
  }

  showHighScore(){
   // this.sound.play('player_shoot');
     this.scene.switch('Score');
     // var values = [];
     // var keys = Object.keys(localStorage);
     // let i = keys.length;

     // while(i--){
     //   values.push(JSON.parse(localStorage.getItem(keys[i])));
     //  //  console.log(values[i]);
     // }

     //  values.sort((a,b) => (a.score > b.score) ? 1 : -1);


  
     // console.log(values[keys.length-1].username + ' score: ' + values[keys.length-1].score);
     // console.log(values[keys.length-2].username + ' score: ' + values[keys.length-2].score);
     // console.log(values[keys.length-3].username + ' score: ' + values[keys.length-3].score);
   

    


  }
  
 
}