Class.create("Survivant", {
    element: null,
    direction: "none",
    texture: "fillette",
    type: "fuyards",
    case: 32,
    perso: 64,
    target: {x: 0, y: 0},
    scene: null,
    hitbox: null,
    initialize: function(scene, stage, coords, type) {
    	if( !scene || !coords || typeof coords != "object" )
    		return false;
        this.scene = scene;
    	this.texture = type;
        this.type = type;
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
        this.hitbox.rect( 32 );
        this.hitbox.position( coords.x, coords.y );
        this.hitbox.el = this.element;
    },
    move: function() {
        if( this.element.x > this.target.x ) {
            this.element.x -= 4;
            this.hitbox.move( -4, 0 );
        } else if( this.element.x < this.target.x ) {
            this.element.x += 4;
            this.hitbox.move( 4, 0 );
        }
        if( this.element.y < this.target.y ) {
            this.element.y += 4;
            this.hitbox.move( 0, 4 );
        } else if( this.element.y > this.target.y ) {
            this.element.y -= 4;
            this.hitbox.move( 0, -4 );
        }
        return;
    },
    to: function( coords ) {
        if( !coords || typeof coords != "object" )
            return;
        this.target = coords;
    },
    isMoved: function() {
        
    }
});