canvas.Scene.new({
    name: "Bellecour", // Obligatory
    next: "Parking", // niveau suivant
    walkers: [],
    survivants: [],
    murs: [],
    sorties: [],
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
            noir: "assets/sprites/noir.png",
            zombie: "assets/sprites/zombie.png"
        }
    },
    //Method called at each resource loaded in the materials property
    preload: function(stage, pourcent) {

    },
    //Method called when resources are loaded
    ready: function(stage) {
        GameReady.bind( this )( stage, {action:false}, "bellecour.json", {required: 7, total: 14});
    },
    //Method called at each render (60 FPS)
    render: function(stage) {
        GameRender.bind( this )( stage );

        stage.refresh();
    },
    //Method called when this scene is quitted (or another scene is called)
    exit: function(stage) {
        GameExit.bind( this )( stage );
    }
});