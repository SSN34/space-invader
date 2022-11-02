const Game = {
    currentScene: "",
    ctx: undefined,
    ship: [],
    aliens: [],
    life: 3,
    images: {},
    scenes: {},
};

const starColors = [
    "red",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "grey",
    "grey",
    "grey",
    "grey",
    "orange",
    "orange",
    "yellow",
    "yellow",
];

Game.init = function (context) {
    this.ctx = context;
    this.currentScene = "start";
};

Game.load = function () {
    ["images/title.png"].forEach((src) => {
        let image = new Image();
        image.src = src;

        Game.images[src.split("/")[1].split(".")[0]] = image;
    });
};

Game.createLevels = function () {
    // start SCENE
    let startScene = new Scene();

    // add image in order of FIFO
    startScene.addImage(
        new CtxImage(Game.images["title"], {
            x: (WIDTH - Game.images["title"].width) / 2,
            y: -50,
        }, true)
    );
    startScene.addObject(
        "background",
        new Rect({ x: 0, y: 0 }, WIDTH, HEIGHT, "black")
    );
    for (let i = 0; i < 200; i++) {
        startScene.addObject(
            "star",
            new Rect(
                { x: Math.random() * WIDTH, y: Math.random() * HEIGHT },
                Math.random() * 3,
                Math.random() * 3,
                starColors[Math.floor(Math.random() * 19)],
            )
        );
    }

    startScene.update = function () {
        this.objects["star"].forEach((star) => {
            star.position.y += 1;

            if (star.position.y > HEIGHT) {
                star.position.x = Math.random() * WIDTH;
                star.position.y = 0;
            }
        });

    };
    Game.scenes["start"] = startScene;

    // play scene
    let playScene = new Scene();

    // added stars background
    playScene.objects = startScene.objects;
    
    // add some object for life
    
    // add alien objects to this scene
    
    // add spaceship object to the scene

    // add to this update function to move the respective objects present in play scene
    // this function should also contain logic for collision among the objects
    playScene.update = function () {
        this.objects["star"].forEach((star) => {
            star.position.y += 1.5;

            if (star.position.y > HEIGHT) {
                star.position.x = Math.random() * WIDTH;
                star.position.y = 0;
            }
        });
    };


    Game.scenes["play"] = playScene;
};

Game.drawLevel = function () {
    this.scenes[this.currentScene].draw();
    this.scenes[this.currentScene].update();

    //add condition for win
    //add condition for lose
};
