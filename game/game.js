var canvas = CE.defines("canvas_id").
extend(Input).
extend(Tiled).
extend(Animation).
extend(Hit).
ready(function() {
    canvas.Scene.call("Menu");
});


