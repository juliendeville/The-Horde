Class.create("Zombie", {
    element: null,
    direction: "none",
    texture: "zombie",
    hitbox: null,
    case: 32,
    perso: 64,
    steps: 0,
    step: 0,
    path: null,
    rank: 0,
    scene: null,
    hitbox: null,
    follower: null,
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
        this.element.x = coords.x;
        this.element.y = coords.y;
        //this.element.addLoopListener( this.move.bind( this ) );
        this.hitbox = Class.New("Entity", [stage]);
        this.hitbox.rect( 12 );
        this.hitbox.position( coords.x+10 - this.base_x, coords.y+10 - this.base_y );
    },
    move: function() {
        var self = this;

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
            self.element.y += hitmove;
            self.hitbox.move( 0, hitmove );
        }
        if( hitmove > 0 )
            self.step++;
        if( self.step == self.steps ) {
            self.step = 0;
        }

        if( self.follower ){
            self.follower.move();
        }
/*
        if( this.path[this.path.length - 1-this.rank] ) {
            if( this.element.x > this.path[this.path.length - 1-this.rank].x ) {
                this.element.x -= this.speed;
                this.hitbox.move( -this.speed, 0 );
            } else if( this.element.x < this.path[this.path.length - 1-this.rank].x ) {
                this.element.x += this.speed;
                this.hitbox.move( this.speed, 0 );
            }
            if( this.element.y < this.path[this.path.length - 1-this.rank].y ) {
                this.element.y += this.speed;
                this.hitbox.move( 0, this.speed );
            } else if( this.element.y > this.path[this.path.length - 1-this.rank].y ) {
                this.element.y -= this.speed;
                this.hitbox.move( 0, -this.speed );
            }

            if( this.follower ){
                this.follower.move();
            }
        }
        */
        return;
    },
    UpRank: function() {
        this.rank++;
        if( this.follower )
            this.follower.UpRank();
    },
    DownRank: function() {
        this.rank--;
        if( this.follower )
            this.follower.DownRank();
    },
    IndependanceDay: function() {
        this.element.addLoopListener( this.move.bind( this ) );
        this.rank = 0;
    },
    changeSteps: function( steps ) {
        this.steps = steps;
        
        if( this.follower ){
            this.follower.changeSteps(steps);
        }
    }
});