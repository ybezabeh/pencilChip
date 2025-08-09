const W=960,H=540;
const config={ type:Phaser.AUTO,parent:'game',width:W,height:H,pixelArt:true,backgroundColor:'#0f131a',
 physics:{ default:'arcade', arcade:{ gravity:{ y:1200 }, debug:false } }, scene:[Boot,Menu,Level1] };
new Phaser.Game(config);

function Boot(){Phaser.Scene.call(this,{key:'Boot'})} Boot.prototype=Object.create(Phaser.Scene.prototype);
Boot.prototype.preload=function(){
  ['bg_far','bg_back','bg_mid','bg_front','vignette','platform','ui_panel','logo','spoon','chip_flat','popcorn'].forEach(k=>this.load.image(k,'assets/'+k+'.png'));
  this.load.spritesheet('spud','assets/spud_sheet.png',{frameWidth:32,frameHeight:32});
  this.load.spritesheet('pencil','assets/pencil_sheet.png',{frameWidth:32,frameHeight:32});
  this.load.spritesheet('butter','assets/butter_sheet.png',{frameWidth:32,frameHeight:32});
  this.load.spritesheet('kettle','assets/kettle_sheet.png',{frameWidth:32,frameHeight:32});
  this.load.spritesheet('chip','assets/chip_anim.png',{frameWidth:16,frameHeight:16});
  this.load.spritesheet('oil','assets/oil_anim.png',{frameWidth:32,frameHeight:16});
  this.load.spritesheet('chipling','assets/chipling_sheet.png',{frameWidth:16,frameHeight:16});
  ['jump','collect','hit','pop','ui'].forEach(s=>this.load.audio(s,'assets/'+s+'.wav'));
};
Boot.prototype.create=function(){
  this.anims.create({key:'spud_idle',frames:this.anims.generateFrameNumbers('spud',{start:0,end:2}),frameRate:3,repeat:-1});
  this.anims.create({key:'spud_run',frames:this.anims.generateFrameNumbers('spud',{start:3,end:6}),frameRate:10,repeat:-1});
  this.anims.create({key:'spud_jump',frames:[{key:'spud',frame:7}],frameRate:1});
  this.anims.create({key:'spud_slide',frames:[{key:'spud',frame:8}],frameRate:1});
  this.anims.create({key:'spud_roll',frames:this.anims.generateFrameNumbers('spud',{start:9,end:11}),frameRate:12,repeat:-1});
  this.anims.create({key:'pencil_idle',frames:this.anims.generateFrameNumbers('pencil',{start:0,end:2}),frameRate:3,repeat:-1});
  this.anims.create({key:'pencil_taunt',frames:this.anims.generateFrameNumbers('pencil',{start:3,end:5}),frameRate:4,repeat:-1});
  this.scene.start('Menu');
};

function Menu(){Phaser.Scene.call(this,{key:'Menu'})} Menu.prototype=Object.create(Phaser.Scene.prototype);
Menu.prototype.create=function(){
  this.add.image(0,0,'bg_far').setOrigin(0,0);
  this.add.image(0,0,'bg_back').setOrigin(0,0).setScrollFactor(0.1);
  this.add.image(0,0,'bg_mid').setOrigin(0,0).setScrollFactor(0.2);
  this.add.image(0,0,'bg_front').setOrigin(0,0).setScrollFactor(0.4);
  this.add.image(W/2,110,'logo').setScale(1.2);
  const b=this.add.image(W/2, 200,'ui_panel');
  this.add.text(W/2,194,'Escape the Chipper!',{fontFamily:'monospace',fontSize:'18px',color:'#ffd15a'}).setOrigin(0.5,0);
  this.add.text(W/2,220,'← → Move   ↑ Jump   ↓ Slide/Roll',{fontFamily:'monospace',fontSize:'14px',color:'#cde4ff'}).setOrigin(0.5,0);
  const start=this.add.text(W/2,280,'▶ Start Level 1',{fontFamily:'monospace',fontSize:'18px',color:'#ffffff',backgroundColor:'#2c3550',padding:{left:12,right:12,top:6,bottom:6}}).setOrigin(0.5).setInteractive({useHandCursor:true});
  start.on('pointerup',()=>{ this.sound.play('ui',{volume:0.4}); this.scene.start('Level1'); });
  this.add.image(W/2,H/2,'vignette').setDepth(10).setAlpha(0.7);
};

function Level1(){Phaser.Scene.call(this,{key:'Level1'})} Level1.prototype=Object.create(Phaser.Scene.prototype);
Level1.prototype.create=function(){
  // Parallax
  this.lFar = this.add.tileSprite(0,0,W,H,'bg_far').setOrigin(0,0).setScrollFactor(0);
  this.lBack= this.add.tileSprite(0,0,W,H,'bg_back').setOrigin(0,0).setScrollFactor(0.15);
  this.lMid = this.add.tileSprite(0,0,W,H,'bg_mid').setOrigin(0,0).setScrollFactor(0.25);
  this.lFront=this.add.tileSprite(0,0,W,H,'bg_front').setOrigin(0,0).setScrollFactor(0.45);
  this.vignette=this.add.image(W/2,H/2,'vignette').setScrollFactor(0).setDepth(100).setAlpha(0.6);

  // World
  this.worldWidth=4200;
  this.physics.world.setBounds(0,0,this.worldWidth,H);
  this.cameras.main.setBounds(0,0,this.worldWidth,H);

  // Platforms
  this.platforms=this.physics.add.staticGroup();
  for(let x=0;x<this.worldWidth;x+=128) this.platforms.create(x,H-24,'platform').setOrigin(0,1).refreshBody();
  [700,980,1320,1680,2100,2480,2860,3240].forEach((px,i)=>this.platforms.create(px,H-(120+((i%3)*60)),'platform').setOrigin(0,1).refreshBody());

  // Player
  this.player=this.physics.add.sprite(90,H-90,'spud').setScale(2);
  this.player.body.setSize(18,22).setOffset(7,6);
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player,this.platforms);
  this.player.play('spud_idle');
  this.cursors=this.input.keyboard.createCursorKeys();
  this.cameras.main.startFollow(this.player,true,0.12,0.12);

  // NPCs
  this.butter=this.add.sprite(520,H-76,'butter').setScale(2); this.anims.create({key:'butter_wave',frames:this.anims.generateFrameNumbers('butter',{start:0,end:1}),frameRate:2,repeat:-1}); this.butter.play('butter_wave');
  this.kettle=this.add.sprite(1600,H-84,'kettle').setScale(2); this.anims.create({key:'kettle_steam',frames:this.anims.generateFrameNumbers('kettle',{start:0,end:1}),frameRate:2,repeat:-1}); this.kettle.play('kettle_steam');

  // Chiplings
  this.chiplings=this.physics.add.group();
  [1200,1900,2600].forEach(x=>{ const c=this.chiplings.create(x,H-84,'chipling').setScale(2); c.body.allowGravity=false; this.tweens.add({targets:c,y:c.y-8,yoyo:true,duration:800,repeat:-1,ease:'Sine.inOut'}); });
  this.rescued=0;
  this.physics.add.overlap(this.player,this.chiplings,(pl,c)=>{ c.destroy(); this.sound.play('collect'); this.rescued++; this.toast(`Rescued Chipling (${this.rescued}/3)`); });

  // Hazards
  this.hazards=this.physics.add.group({allowGravity:false,immovable:true});
  [[760,H-40],[1460,H-200],[2350,H-180],[3120,H-160]].forEach(([x,y])=>{ const h=this.hazards.create(x,y,'chip').setScale(2); h.play('chip_glint'); h.isChip=true; });
  [[560,H-24],[1800,H-24],[2520,H-24],[3480,H-24]].forEach(([x,y])=>{ const o=this.hazards.create(x,y-8,'oil').setScale(2); o.play('oil_shimmer'); o.isOil=true; });
  // Swinging spoon
  this.spoon=this.physics.add.sprite(2100,140,'spoon').setScale(2); this.spoon.body.allowGravity=false; this.tweens.add({targets:this.spoon,angle:30,yoyo:true,duration:900,repeat:-1,ease:'Sine.inOut'});
  this.physics.add.overlap(this.player,this.spoon,()=>this.killPlayer());

  this.physics.add.overlap(this.player,this.hazards,(pl,h)=>{ if(h.isChip) this.killPlayer(); if(h.isOil) this.player.setVelocityX(this.player.body.velocity.x*1.15); });

  // Pencil AI
  this.pencil=this.physics.add.sprite(500,110,'pencil').setScale(2); this.pencil.body.allowGravity=false; this.pencil.play('pencil_idle');
  this.ai={state:'patrol',t:0,dir:1};

  // UI
  this.uiPanel=this.add.image(16,16,'ui_panel').setOrigin(0,0).setScrollFactor(0);
  this.txtRes=this.add.text(26,22,'Rescued: 0/3',{fontFamily:'monospace',fontSize:'14px',color:'#ffffff'}).setScrollFactor(0);
  this.txtGoal=this.add.text(W/2,30,'Find why the Pencil hunts potatoes…',{fontFamily:'monospace',fontSize:'14px',color:'#ffd15a'}).setScrollFactor(0).setOrigin(0.5,0);
  this.progress=this.add.rectangle(26,40,0,6,0xffc658).setScrollFactor(0).setOrigin(0,0.5);

  // Pause
  this.input.keyboard.on('keydown-P',()=>this.togglePause());

  // Decorative blinking warnings (fake via camera flash)
  this.time.addEvent({ delay: 1200, loop:true, callback: ()=> this.cameras.main.flash(80, 255,60,40, false) });
};

Level1.prototype.togglePause=function(){
  if(this.scene.isPaused()){ this.scene.resume(); this.sound.play('ui',{volume:0.3}); }
  else { this.scene.pause(); this.sound.play('ui',{volume:0.3}); const t=this.add.text(this.cameras.main.scrollX+W/2,H/2,'PAUSED (P to resume)',{fontFamily:'monospace',fontSize:'18px',color:'#ffffff',backgroundColor:'#2c3550'}).setOrigin(0.5).setScrollFactor(0); this.time.delayedCall(800,()=>t.destroy()); }
};

Level1.prototype.update=function(time,dt){
  if(this.dead) return;
  const c=this.cursors, speed=240;
  if(c.left.isDown){ this.player.setVelocityX(-speed); this.player.setFlipX(true); if(this.player.body.onFloor()) this.player.play('spud_run',true); }
  else if(c.right.isDown){ this.player.setVelocityX(speed); this.player.setFlipX(false); if(this.player.body.onFloor()) this.player.play('spud_run',true); }
  else { this.player.setVelocityX(0); if(this.player.body.onFloor()) this.player.play('spud_idle',true); }
  if(Phaser.Input.Keyboard.JustDown(c.up) && this.player.body.onFloor()){ this.player.setVelocityY(-530); this.player.play('spud_jump'); this.sound.play('jump',{volume:0.42}); }
  if(c.down.isDown && this.player.body.onFloor()){ this.player.play('spud_slide'); this.player.setVelocityX(this.player.flipX?-300:300); }

  this.updateAI(dt);

  // Progress/UI
  this.txtRes.setText(`Rescued: ${this.rescued}/3`);
  const prog = Phaser.Math.Clamp(this.player.x/(this.physics.world.bounds.width-140),0,1);
  this.progress.width = 200*prog;

  // Parallax scroll
  const sx=this.cameras.main.scrollX;
  this.lBack.tilePositionX = sx*0.15;
  this.lMid.tilePositionX  = sx*0.25;
  this.lFront.tilePositionX= sx*0.45;

  if(this.player.x>this.physics.world.bounds.width-140 && this.rescued>=1){ this.scene.start('Menu'); }
};

Level1.prototype.updateAI=function(dt){
  this.ai.t+=dt;
  if(this.ai.state==='patrol'){
    this.pencil.x += this.ai.dir*70*(dt/1000);
    if(this.pencil.x<360) this.ai.dir=1;
    if(this.pencil.x>760) this.ai.dir=-1;
    if(Math.abs(this.pencil.x - this.player.x) < 240){ this.ai.state='chase'; this.pencil.play('pencil_taunt'); this.cameras.main.zoomTo(1.06,300); }
  }else if(this.ai.state==='chase'){
    this.physics.moveToObject(this.pencil,this.player,130);
    if(this.ai.t>1900){ this.ai.t=0; this.spawnSpikeAhead(); }
    if(Phaser.Math.Distance.Between(this.player.x,this.player.y,this.pencil.x,this.pencil.y)<40){ this.killPlayer(); }
  }
};

Level1.prototype.spawnSpikeAhead=function(){
  const x=this.player.x+220, y=H-40;
  const s=this.physics.add.sprite(x,y,'chip').setScale(2).play('chip_glint'); s.body.allowGravity=false; s.isChip=true; this.hazards.add(s);
};

Level1.prototype.killPlayer=function(){
  if(this.dead) return; this.dead=true; this.sound.play('pop',{volume:0.7});
  this.player.setVelocity(-140*(this.player.flipX?-1:1), -560);
  this.player.setAngularVelocity(480);
  const x=this.player.x;
  this.time.delayedCall(680,()=>{
    this.add.image(x,H-32,'chip_flat').setScale(2);
    this.player.setVisible(false);
    this.cameras.main.flash(150,255,230,120);
    this.time.delayedCall(900,()=>this.scene.restart());
  });
};

Level1.prototype.toast=function(text){
  const t=this.add.text(this.cameras.main.scrollX+W/2, 90, text, {fontFamily:'monospace',fontSize:'16px',color:'#ffffff',backgroundColor:'#2c3550'}).setOrigin(0.5).setScrollFactor(0);
  this.tweens.add({targets:t,alpha:0,duration:1400,onComplete:()=>t.destroy()});
};
