canvas.Scene.new({
  name: "Menu", // Obligatory
  materials: {
    images: {
        background: "assets/sprites/menu.png"
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

    self.backg = self.createElement();
    self.backg.drawImage("background");
    self.backg.x = 0;
    self.backg.y = 0;

    self.backg.click( function() {
      canvas.Scene.call("Bellecour");
    });

    stage.append( self.backg );
  },
  //Method called at each render (60 FPS)
  render: function(stage) {
    var self = this;
    stage.refresh();
  },
  //Method called when this scene is quitted (or another scene is called)
  exit: function(stage) {

  }
});