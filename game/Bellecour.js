canvas.Scene.new({
  name: "Bellecour", // Obligatory
  walkers: [],
  survivants: [],
  murs: [],
  materials: {
    images: {
        Arbre: "assets/sprites/Arbre.png",
        fond: "assets/sprites/bellecour.jpg",
        dada: "assets/sprites/dada.jpg",
        fillette: "assets/sprites/fille.png",
        heros: "assets/sprites/fille.png",
        fuyards: "assets/sprites/fille.png",
        terrifies: "assets/sprites/fille.png",
        alpha: "assets/sprites/alpha.png",
        zombie: "assets/sprites/zombie.png"
    }
  },
  //Method called at each resource loaded in the materials property
  preload: function(stage, pourcent) {

  },
  //Method called when resources are loaded
  ready: function(stage) {
    var self = this;

    //déclaration des contrôles
    self.controls = Class.new("Controls");

    //création de la map
    self.tiledMap = self.createElement();
    self.tiled = canvas.Tiled.new();

    self.hitmurs = [];
    self.hitsurvivants = [];
    self.hitwalkers = [];
    //chargement de la map
    self.tiled.load(self, self.tiledMap, "bellecour.json");
    self.tiled.ready(function() {

      //apparition des ennemis sur la map
      self.tiled.layers.forEach( function( espece ) 
        { 
          //les calques de tiles
          if( espece.type != "objectgroup" )
            return;

          if( espece.name == "joueur" ) {
            self.player = Class.new( "Player", [ self, stage, espece.objects[0] ] );
          } else if( espece.name == "fuyards" ) {
            espece.objects.forEach( function( surv ) {
              self.survivants.push( Class.new( "Survivant", [ self, stage, surv, "fuyards" ] ) );
            });
          } else if( espece.name == "heros" ) {
            espece.objects.forEach( function( surv ) {
              self.survivants.push( Class.new( "Survivant", [ self, stage, surv, "heros" ] ) );
            });
          } else if( espece.name == "terrifies" ) {
            espece.objects.forEach( function( surv ) {
              self.survivants.push( Class.new( "Survivant", [ self, stage, surv, "terrifies" ] ) );
            });
          } else if( espece.name == "murs" ) {
            espece.objects.forEach( function( mur ) {
              self.murs.push( Class.new( "Mur", [ self, stage, mur ] ) );
            });
          }
        }
      );

      self.map = self.createElement();
      self.map.append( self.tiledMap );
      self.survivants.forEach( function( survivant ) {
        self.hitsurvivants.push( survivant.hitbox );
        self.map.append( survivant.element );
      });
      self.murs.forEach( function( mur ) {
        self.hitmurs.push( mur.hitbox );
        self.map.append( mur.element );
      });
      self.map.append( self.player.element );
      self.map.append( self.player.hitbox.el );
      stage.append( self.map );
    });


  },
  //Method called at each render (60 FPS)
  render: function(stage) {
    var self = this;
      if( self.player && self.player.hitbox ) {

        if( self.controls.state.action ) {
          if( self.player.follower ) {
            var bouclier = self.player.follower;
            //bouclier.speed = 3;

            var hittempx = bouclier.hitbox.el.x;
            var hittempy = bouclier.hitbox.el.y;
            var tempx = bouclier.element.x;
            var tempy = bouclier.element.y;
            bouclier.element.x = self.player.element.x;
            bouclier.element.y = self.player.element.y;
            bouclier.hitbox.move( self.player.hitbox.el.x - bouclier.hitbox.el.x, self.player.hitbox.el.y - bouclier.hitbox.el.y );
            self.player.element.x = tempx;
            self.player.element.y = tempy;
            self.player.hitbox.move( hittempx - self.player.hitbox.el.x, hittempy - self.player.hitbox.el.y );
            self.player.follower = bouclier.follower;
            if( self.player.follower )
              self.player.follower.DownRank();
            self.player.path.pop();

            bouclier.IndependanceDay();
            bouclier.follower = null;

            if( self.player.direction == "right" ) {
              bouclier.path = [{
                x: Infinity, 
                y: bouclier.path[bouclier.path.length-1].y 
              }];
            } else if( self.player.direction == "up" ) {
              bouclier.path = [{
                x: bouclier.path[bouclier.path.length-1].x,
                y: 0
              }];
            } else if( self.player.direction == "left" ) {
              bouclier.path = [{
                x: 0, 
                y: bouclier.path[bouclier.path.length-1].y 
              }];
            } else if( self.player.direction == "down" ) {
              bouclier.path = [{
                x: bouclier.path[bouclier.path.length-1].x,
                y: Infinity 
              }];
            } 
          }
          self.controls.state.action = false;
        }

        if( self.controls.state.right ) {
          self.player.direction = "right";
        } else if( self.controls.state.up ) {
          self.player.direction = "up";
        } else if( self.controls.state.left ) {
          self.player.direction = "left";
        } else if( self.controls.state.down ) {
          self.player.direction = "down";
        } 

        self.hitsurvivants.forEach( function( surv ) {
          surv.hit( [ self.player.hitbox ], function( state, el ) {
            if (state == "over") {
              el.dead = true;
            } else {
              if( el.dead && !el.undead ) {
                var walker = Class.new( "Zombie", [ self, stage, el ] );
                self.hitwalkers.push( walker.hitbox );
                self.walkers.push( walker );
                self.player.addFollower( walker );
                stage.append( walker.element );
                el.hide();
                el.undead = true;
              }
            }
          }); 
        });

        self.player.hitbox.hit( self.hitmurs, function( state, el ) {
          if (state == "over") {
            //game over
            canvas.Scene.call("Menu");
          }
        });

        self.player.hitbox.hit( self.hitwalkers, function( state, el ) {
          if (state == "over") {
            //game over
            //canvas.Scene.call("Menu");
            canvas.Scene.call("Menu");
          }
        });
      }

    stage.refresh();
  },
  //Method called when this scene is quitted (or another scene is called)
  exit: function(stage) {
    var self = this;
    delete self.player;
    self.player = null;
    self.walkers.forEach( function( el ) {
      delete el;
    });
    self.hitwalkers.forEach( function( el ) {
      delete el;
    });
    self.hitsurvivants.forEach( function( el ) {
      delete el;
    });
    self.murs.forEach( function( el ) {
      delete el;
    });
    delete self.controls;
    self.controls = null;
  }
});