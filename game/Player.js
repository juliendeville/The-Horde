Class.create("Player", {
    protected: false,
    element: null,
    direction: "none",
    texture: "alpha",
    hitbox: null,
    case: 32,
    perso: 64,
    speed: 4,
    target: {x: 0, y: 0},
    scene: null,
    hitbox: null,
    follower: null,
    initialize: function(scene, stage, coords, texture) {
    	if( !scene || !coords || typeof coords != "object" )
    		return false;
        this.scene = scene;
    	if( texture )
    		this.texture = texture;
        this.element = this.scene.createElement();
        this.element.drawImage( this.texture );
        var x = coords.x - this.perso / 2 + this.case / 2;
        var y =  coords.y - this.perso + this.case;
        this.element.x = x;
        this.element.y = y;
        this.target.x = x;
        this.target.y = y;
        this.element.addLoopListener( this.move.bind( this ) );
        this.hitbox = Class.New("Entity", [stage]);
        this.hitbox.rect( 30 );
        this.hitbox.position( coords.x+1, coords.y+1 );
        //this.hitbox.el.fillStyle = "#FF0000";
        //this.hitbox.el.fillRect(0,0, 30, 30);
    },
    move: function() {
        if( this.target.x == this.element.x && this.target.y == this.element.y ){
            if( this.direction == "right" ) {
                this.target.x += this.case;
            } else if( this.direction == "up" ) {
                this.target.y -= this.case;
            } else if( this.direction == "left" ) {
                this.target.x -= this.case;
            } else if( this.direction == "down" ) {
                this.target.y += this.case;
            }
            this.follower.to( this.target );
        }

        if( this.element.x > this.target.x ) {
            this.element.x -= this.speed;
            this.hitbox.move( -this.speed, 0 );
        } else if( this.element.x < this.target.x ) {
            this.element.x += this.speed;
            this.hitbox.move( this.speed, 0 );
        }
        if( this.element.y < this.target.y ) {
            this.element.y += this.speed;
            this.hitbox.move( 0, this.speed );
        } else if( this.element.y > this.target.y ) {
            this.element.y -= this.speed;
            this.hitbox.move( 0, -this.speed );
        }
        return;
    },
    to: function( coords ) {
        if( !coords || typeof coords != "object" )
            return;
        this.target = coords;
        
    },
    addFollower: function( follower ) {
        if( this.follower ) {
            var walker = this.follower;
            this.follower = follower;
            this.follower.addFollower( walker );
            this.follower.target = {x: this.element.x, y: this.element.y };
            this.follower.follower.target = {x: this.follower.x, y: this.follower.y };
        } else
            this.follower = follower;
    }
});