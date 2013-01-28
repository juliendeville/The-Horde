canvas.Scene.new({
    name: "Parking", // Obligatory
    next: "Mall", // niveau suivant
    walkers: [],
    survivants: [],
    murs: [],
    sorties: [],
    materials: {
        images: {
            bitume: "assets/sprites/bitume.png",
            murs: "assets/sprites/murs.png",
            trace: "assets/sprites/trace.png",
            trace2: "assets/sprites/trace2.png",
            trace3: "assets/sprites/trace3.png",
            voiture1: "assets/sprites/voiture1.png",
            voiture2: "assets/sprites/voiture2.png",
            voiture3: "assets/sprites/voiture3.png",
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
        GameReady.bind( this )( stage, {action:false}, "parking.json", {required: 30, total: 51});
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