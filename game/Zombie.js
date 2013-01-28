Class.create("Zombie", {
    element: null,
    direction: "none",
    texture: "zombie",
    hitbox: null,
    case: 32,
    perso: 64,
    speed: 3,
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
    }
});