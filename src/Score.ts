

export class Score extends Phaser.Scene {




  constructor() {
    super("Score");
  }

  preload(){
    this.load.image('menu_bg', "./assets/menu/bg.png")
  }

  create() {

    console.log("MENU");

    this.add.image(0,0,'menu_bg').setOrigin(0);
    this.showHighScore();

  }

  update() {
  
  }
    
    enterButtonHoverState(button){
        button.setStyle({ fill: '#4b5de5'});
    }
    
    enterButtonRestState(button) {
        button.setStyle({ fill: '#1b2fc6' });
  }


  showHighScore(){
   // this.sound.play('player_shoot');

     let style = { font: "bold 25px Georgia", fill: "#1b2fc6", boundsAlignH: "center", boundsAlignV: "middle" };
     let styleScore = { font: " 14px Arial", fill: "#f4e542", boundsAlignH: "center", boundsAlignV: "middle" };
     this.add.text(180,20, 'Top 5 players ', style)
     
     let y = 100;
    
     var values = [];
     var keys = Object.keys(localStorage);
     let i = keys.length;

     while(i--){
       values.push(JSON.parse(localStorage.getItem(keys[i])));
      //  console.log(values[i]);
     }

      values.sort((a,b) => (a.score > b.score) ? 1 : -1);



      var num:number = 1; 
  
      while(num <= keys.length) { 
       
         console.log(num);
         this.add.text(100, y, num+'.  Name: ' + values[keys.length-num].username + ' score: ' + values[keys.length-num].score, styleScore);
         y+=50;
         num++; 

         if(num == 6){break;}
      } 

      // this.add.text(100, y, '1.  Name: ' + values[keys.length-1].username + ' score: ' + values[keys.length-1].score, styleScore);
      // y+=50;
      // this.add.text(100, y, '2.  Name: ' + values[keys.length-2].username + ' score: ' + values[keys.length-2].score, styleScore);
      // y+=50;
      // this.add.text(100, y, '3.  Name: ' +values[keys.length-3].username + ' score: ' + values[keys.length-3].score, styleScore);

      y+=100;

       const exitButton = this.add.text(200, y, 'Go back ', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(exitButton) )
      .on('pointerout', () => this.enterButtonRestState(exitButton) )
      .on('pointerdown', () => this.scene.switch('Menu') );

  
     console.log(values[keys.length-1].username + '     score: ' + values[keys.length-1].score);
     console.log(values[keys.length-2].username + '     score: ' + values[keys.length-2].score);
     console.log(values[keys.length-3].username + '     score: ' + values[keys.length-3].score);
   

  }
  
 
}