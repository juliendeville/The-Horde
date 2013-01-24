var canvas = CE.defines("canvas_id").
extend(Input).
extend(Tiled).
extend(Animation).
extend(Hit).
ready(function() {
  canvas.Scene.call("Menu");
});

function GameReady( stage, allowed_controls, map, bar ) {

    var self = this;
    self.debut = new Date();
console.log( "debut", new Date() -self.debut );
    self.bar_settings = bar;
    self.nb_killed = 0;

    self.bar_required = self.createElement();
    self.bar_required.fillStyle = "red";
    self.bar_required.x = 0;
    self.bar_bonus = self.createElement();
    self.bar_bonus.fillStyle = "blue";
    self.bar_bonus.x = 0;
    stage.append( self.bar_required );
    stage.append( self.bar_bonus );
    self.survivants = [];
    var end = false;

    //déclaration des contrôles
    self.controls = Class.new("Controls", [allowed_controls]);

    //création de la map
    self.tiledMap = self.createElement();
    self.tiled = canvas.Tiled.new();

    self.hitmurs = [];
    self.hitsurvivants = [];
    self.hitwalkers = [];
    self.hitsorties = [];
    //chargement de la map
    self.tiled.load(self, self.tiledMap, map);
    self.tiled.ready(function() {
        self.sol = self.tiled.map.children()[0];
        self.normal = self.tiled.map.children()[1];
        self.air = self.tiled.map.children()[2];
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
                    var survivant = Class.new( "Survivant", [ self, stage, surv, "fuyards" ] ) ;
                    survivant.element.walker = Class.new( "Zombie", [ self, stage, survivant.element ] );
                    self.normal.append( survivant.element.walker.element );
                    survivant.element.walker.element.hide();
                    self.survivants.push( survivant );
                });
            } else if( espece.name == "heros" ) {
                espece.objects.forEach( function( surv ) {
                    var survivant = Class.new( "Survivant", [ self, stage, surv, "heros" ] ) ;
                    survivant.element.walker = Class.new( "Zombie", [ self, stage, survivant.element ] );
                    self.normal.append( survivant.element.walker.element );
                    survivant.element.walker.element.hide();
                    self.survivants.push( survivant );
                });
            } else if( espece.name == "terrifies" ) {
                espece.objects.forEach( function( surv ) {
                    var survivant = Class.new( "Survivant", [ self, stage, surv, "terrifies" ] ) ;
                    survivant.element.walker = Class.new( "Zombie", [ self, stage, survivant.element ] );
                    self.normal.append( survivant.element.walker.element );
                    survivant.element.walker.element.hide();
                    self.survivants.push( survivant );
                });
            } else if( espece.name == "murs" ) {
                espece.objects.forEach( function( mur ) {
                    self.murs.push( Class.new( "Mur", [ self, stage, mur ] ) );
                });
            } else if( espece.name == "sorties" ) {
                espece.objects.forEach( function( mur ) {
                    self.sorties.push( Class.new( "Mur", [ self, stage, mur ] ) );
                });
            }
        }
        );

        self.map = self.createElement();
        self.map.append( self.tiledMap );
        self.survivants.forEach( function( survivant ) {
            self.hitsurvivants.push( survivant.hitbox );
            self.normal.prepend( survivant.element );
        });
        self.murs.forEach( function( mur ) {
            self.hitmurs.push( mur.hitbox );
            self.sol.append( mur.element );
        });
        self.sorties.forEach( function( mur ) {
            self.hitsorties.push( mur.hitbox );
            self.sol.append( mur.element );
        });
        self.normal.append( self.player.element );
        self.normal.append( self.player.hitbox.el );
        stage.append( self.map );
        self.player.element.zIndex( 9999 );
        end = true;
console.log( "fin init pnj", new Date() -self.debut );
    });


console.log( "fin init", new Date() -self.debut );
}

function GameRender( stage ) {
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
                        //self.player.element.zIndex( 9999 );
                } else {
                    if( el.dead && !el.undead ) {
                        var walker = el.walker;
                        self.walkers.push( walker );
                        self.player.addFollower( walker );
                        del.bind( el )();
                        show.bind( walker.element )();
                        self.hitwalkers.push( walker.hitbox );
                        el.undead = true;
                        self.nb_killed++;

                        if( self.nb_killed > self.bar_settings.required ) {
                            self.bar_bonus.fillRect( 
                                1408,
                                (self.bar_settings.total-self.nb_killed)/ self.bar_settings.total*896, 
                                20, 
                                (self.nb_killed-self.bar_settings.required) / self.bar_settings.total * 896
                            );
                            self.bar_required.fillStyle = "green";
                            self.bar_required.fillRect( 
                                1408, 
                                896 - self.bar_settings.required / self.bar_settings.total * 896, 
                                20, 
                                self.bar_settings.required / self.bar_settings.total * 896 
                            );
                        } else {
                            self.bar_required.fillRect( 
                                1408, 
                                896 - self.nb_killed / self.bar_settings.total * 896, 
                                20, 
                                self.nb_killed / self.bar_settings.total * 896 
                            );
                        }
                    }
                }
            }); 
        });
        var end = false;
        self.player.hitbox.hit( self.hitmurs, function( state, el ) {
            if (state == "over") {
                //game over
                canvas.Scene.call("Menu");
                end = true;
            }
        });
        if( end )
            return;

        self.player.hitbox.hit( self.hitsorties, function( state, el ) {
            if (state == "over") {
                //game over
                if( self.nb_killed > self.bar_settings.required )
                    canvas.Scene.call( self.next );
                else
                    canvas.Scene.call("Menu");
                end = true;
            }
        });
        if( end )
            return;

        self.player.hitbox.hit( self.hitwalkers, function( state, el ) {
            if (state == "over") {

                canvas.Scene.call("Menu");
                end = true;
            }
        });
        if( end )
            return;
    }
}

function GameExit( stage ) {

    var self = this;
    delete self.player;
    self.player = null;
    self.walkers.forEach( function( el ) {
        delete el;
    });
    self.walkers = null;
    self.hitwalkers.forEach( function( el ) {
        delete el;
    });
    self.hitwalkers = null;
    self.hitsurvivants.forEach( function( el ) {
        delete el;
    });
    self.hitsurvivants = null;
    self.hitmurs.forEach( function( el ) {
        delete el;
    });
    self.hitmurs = null;
    self.hitsorties.forEach( function( el ) {
        delete el;
    });
    self.hitsorties = null;
    self.murs.forEach( function( el ) {
        delete el;
    });
    self.murs = null;
    delete self.controls;
    self.controls = null;
    self.tiled = null;
    self.tiledMap = null;
    self.survivants = null;
    self.normal = null;
    self.sorties = null;
    self.bar_settings = null;
    self.nb_killed = 0;
    self.map = null;
}

function add( el ) {
    this._children.push(el);
    el.parent = this;
    el._index = this._children.length-1;
}

function show() {
    this._visible = true;
}

function del() {
    this.parent._children.splice( this.parent._children.indexOf( this ),1 );
}