Class.create("Mur", {
    initialize: function(scene, stage, mur) {
    	if( !scene )
    		return false;
        this.scene = scene;
        this.hitbox = Class.New("Entity", [stage]);
        this.hitbox.rect( 0, 0, mur.width, mur.height );
        this.hitbox.position( mur.x, mur.y );
        //this.hitbox.el.fillStyle = "#FF0000";
        //this.hitbox.el.fillRect(0,0, mur.width, mur.height);
        this.element = this.hitbox.el;
    }
});