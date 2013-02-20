Class.create("Player", {
    element: null,
    direction: "none",
    texture: "alpha",
    hitbox: null,
    case: 32,
    perso: 64,
    steps: 0,
    step: 0,
    rank: 0,
    scene: null,
    hitbox: null,
    follower: null,
    path: [],
    base_x: 0,
    base_y: 0,
    initialize: function(scene, stage, coords, texture) {
    	if( !scene || !coords || typeof coords != "object" )
    		return false;
        this.scene = scene;
    	if( texture )
    		this.texture = texture;
        this.element = this.scene.createElement();
        this.element.drawImage( this.texture );
        this.base_x = -this.perso / 2 + this.case / 2;
        this.base_y = -this.perso + this.case;
        this.element.x = coords.x + this.base_x;
        this.element.y = coords.y + this.base_y;
        this.path.push( {x: this.element.x, y: this.element.y } );
        this.element.addLoopListener( this.move.bind( this ) );
        this.hitbox = Class.New("Entity", [stage]);
        this.hitbox.rect( 12 );
        this.hitbox.position( coords.x+10 , coords.y+10 );
    },
    move: function() {
        var self = this;

        function walk() {
            /*
            if( self.element.x > self.path[self.path.length - 1].x ) {
                self.element.x -= self.speed;
                self.hitbox.move( -self.speed, 0 );
            } else if( self.element.x < self.path[self.path.length - 1].x ) {
                self.element.x += self.speed;
                self.hitbox.move( self.speed, 0 );
            }
            if( self.element.y < self.path[self.path.length - 1].y ) {
                self.element.y += self.speed;
                self.hitbox.move( 0, self.speed );
            } else if( self.element.y > self.path[self.path.length - 1].y ) {
                self.element.y -= self.speed;
                self.hitbox.move( 0, -self.speed );
            }

*/
            if( self.path.length < 2 + self.rank )
                return;

            var mouvement = self.step / self.steps * self.case;

            var hitmove;
            if( self.path[self.path.length - 1-self.rank].x > self.path[self.path.length - 2-self.rank].x ) {//droite
                hitmove = ( self.path[self.path.length - 1-self.rank].x - self.element.x ) / ( self.steps - self.step );
                self.element.x += hitmove;
                self.hitbox.move( hitmove, 0 );
            } else if( self.path[self.path.length - 1-self.rank].x < self.path[self.path.length - 2-self.rank].x ) {//gauche
                hitmove = ( self.path[self.path.length - 1-self.rank].x - self.element.x ) / ( self.steps - self.step );
                self.element.x += hitmove;
                self.hitbox.move( hitmove, 0 );
            } else if( self.path[self.path.length - 1-self.rank].y > self.path[self.path.length - 2-self.rank].y ) {//bas
                hitmove = ( self.path[self.path.length - 1-self.rank].y - self.element.y ) / ( self.steps - self.step );
                self.element.y += hitmove;
                self.hitbox.move( 0, hitmove );
            } else if( self.path[self.path.length - 1-self.rank].y < self.path[self.path.length - 2-self.rank].y ) {//haut
                hitmove = ( self.path[self.path.length - 1-self.rank].y - self.element.y ) / ( self.steps - self.step );
                //hitmove = Math.round( hitmove * 100 ) / 100;
                self.element.y += hitmove;
                self.hitbox.move( 0, hitmove );
            }
            if( hitmove != 0 )
                self.step++;
            if( self.step == self.steps ) {
                self.step = 0;
            }
/*
            if( self.follower ){
                self.follower.move();
            }
            */
        }
        function direction() {

            if( self.direction == "right" ) {
                self.path.push( {
                    x: self.element.x + ( 1 ) * self.case, 
                    y: self.path[self.path.length - 1].y 
                } );
            } else if( self.direction == "up" ) {
                self.path.push( {
                    x: self.path[self.path.length - 1].x, 
                    y: self.element.y - ( 1 ) * self.case 
                } );
            } else if( self.direction == "left" ) {
                self.path.push( {
                    x: self.element.x - ( 1 ) * self.case, 
                    y: self.path[self.path.length - 1].y 
                } );
            } else if( self.direction == "down" ) {
                self.path.push( {
                    x: self.path[self.path.length - 1].x, 
                    y: self.element.y + ( 1 ) * self.case 
                } );
            }
        }

        if( ( Math.round(this.element.x) + this.base_x ) % this.case == 0 && ( Math.round(this.element.y) + this.base_y ) % this.case == 0 ) {
            direction();
        }

        walk();

        if( this.follower ){
            this.follower.move();
        }
        return;
    },
    addFollower: function( follower ) {
        if( this.follower ) {
            var walker = this.follower;
            this.follower = follower;
            this.follower.follower = walker;
        } else {
            this.follower = follower;
        }
        this.follower.path = this.path;
        this.follower.UpRank();
    },
    changeSteps: function( steps ) {
        this.steps = steps;
        
        if( this.follower ){
            this.follower.changeSteps(steps);
        }
    }
});
