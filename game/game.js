const Game = {
    currentScene: "",
    ctx: undefined,
    ship: [],
    aliens: [],
    life: 3,
    images: {},
    scenes: {},
    audios: {}
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
    [
        "images/title.png",
        "images/ship.png",
        "images/explosion-6.png",
        "images/explosion-1.png",
        "images/alien.png",
    ].forEach((src, i) => {
        let image = new Image();
        image.src = src;

        Game.images[src.split("/")[1].split(".")[0]] = image;
    });

    [
        "audio/blast.mp3",
        "audio/gun.mp3",
        "audio/gameover.mp3",
        "audio/welcome.mp3",
        "audio/hit.mp3"
    ].forEach((src, i) => {
        let audio = new Audio();
        audio.src = src

        Game.audios[src.split("/")[1].split(".")[0]] = audio;
    });
};

Game.createLevels = function () {
    // start SCENE
    let startScene = new Scene();

    // add image in order of FIFO
    startScene.addImage(
        "title",
        new CtxImage(
            Game.images["title"],
            {
                x: (WIDTH - Game.images["title"].width) / 2,
                y: -50,
            },
            true
        )
    );

    startScene.addImage(
        "ship",
        new Ship(
            Game.images["ship"],
            {
                x: (WIDTH - Game.images["ship"].width / 3) / 2,
                y: HEIGHT - 80,
            },
            false,
            3,
            10
        )
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
                starColors[Math.floor(Math.random() * 19)]
            )
        );
    }

    startScene.addObject(
        "message",
        new Message(
            "Press ENTER to play",
            { x: WIDTH / 2, y: HEIGHT / 2 + 50 },
            "15px game-font",
            "white"
        )
    );

    startScene.addObject(
        "message",
        new Message(
            "Use ← and → to move, SPACEBAR to fire",
            { x: WIDTH / 2, y: HEIGHT / 2 + 110 },
            "15px game-font",
            "white"
        )
    );

    startScene.addObject(
        "message",
        new Message(
            "Press ESCAPE to pause",
            { x: WIDTH / 2, y: HEIGHT / 2 + 80 },
            "15px game-font",
            "white"
        )
    );

    startScene.addObject(
        "message",
        new Message(
            "Click anywhere for audio",
            { x: WIDTH / 2, y: HEIGHT / 2 + 140 },
            "10px game-font",
            "white"
        )
    );

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
    playScene.objects = {
        background: startScene.objects["background"],
        star: startScene.objects["star"],
    };

    // add spaceship object to the scene
    playScene.addImage(
        "ship",
        new Ship(
            Game.images["ship"],
            {
                x: (WIDTH - Game.images["ship"].width / 3) / 2,
                y: HEIGHT - 80,
            },
            false,
            3,
            10,
            0.667
        )
    );
    // add some object for life
    playScene.addObject("life", new Message(
        ` x ${Game.life}`,
        {
            x: WIDTH - 50,
            y: 100
        },
        "20px game-font",
        "white"
    ))
    // add alien objects to this scene
    let alienField = [
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    for (let i = 0; i < alienField.length; i++) {
        for (let j = 0; j < alienField[i].length; j++) {
            if (alienField[i][j] === 0) {
                continue;
            }
            playScene.addImage(
                "alien",
                new Alien(
                    Game.images["alien"],
                    {
                        x:
                            WIDTH / 2 -
                            ((Game.images["alien"].width / 2 + 10) *
                                alienField[i].length) /
                                2 +
                            j * (Game.images["alien"].width / 2 + 10),
                        y: i * (Game.images["alien"].height + 10),
                    },
                    false,
                    2,
                    4
                )
            );
        }
    }

    // add to this update function to move the respective objects present in play scene
    // this function should also contain logic for collision among the objects
    playScene.update = function () {
        this.objects["star"].forEach((star) => {
            star.position.y += 3;

            if (star.position.y > HEIGHT) {
                star.position.x = Math.random() * WIDTH;
                star.position.y = 0;
            }
        });

        this.images["ship"][0].updateMovementDirection();

        for (let b = this.objects["bullet"]?.length - 1; b >= 0; b--) {
            this.objects["bullet"][b].position.y -= 5;
            let collision = false;
            for (let ufo = this.images["alien"]?.length - 1; ufo >= 0; ufo--) {
                if (
                    hasCollided(
                        this.objects["bullet"][b],
                        this.images["alien"][ufo]
                    )
                ) {
                    collision = true;
                    Game.audios["blast"].cloneNode().play();
                    this.addImage(
                        "explosion",
                        new CtxImage(
                            Game.images["explosion-6"],
                            {
                                x: this.images["alien"][ufo].position.x,
                                y: this.images["alien"][ufo].position.y,
                            },
                            false,
                            8,
                            10,
                            1,
                            true
                        )
                    );
                    this.images["alien"].splice(ufo, 1);
                    break;
                }
            }
            if (this.objects["bullet"][b].position.y < 0 || collision) {
                this.objects["bullet"].splice(b, 1);
            }
        }

        for (let b = this.objects["bomb"]?.length - 1; b >= 0; b--) {
            this.objects["bomb"][b].position.y += 5;

            let collision = false;
            if(hasCollided(this.objects["bomb"][b], this.images["ship"][0])){
                this.objects["life"][0].text = ` x ${--Game.life}`;
                Game.audios["hit"].play();
                this.addImage(
                    "explosion",
                    new CtxImage(
                        Game.images["explosion-1"],
                        {
                            x: this.images["ship"][0].position.x,
                            y: this.images["ship"][0].position.y,
                        },
                        false,
                        8,
                        10,
                        1,
                        true
                    )
                );
                collision = true;
            }
            if (this.objects["bomb"][b].position.y > HEIGHT || collision) {
                this.objects["bomb"].splice(b, 1);
            }
        }
    };

    Game.scenes["play"] = playScene;
};

Game.generateBomb = function () {
    let totalAliens = Game.scenes[Game.currentScene].images["alien"].length;
    // let randomAlien = Game.scenes[Game.currentScene].images["alien"][0];

    if (totalAliens == 0) {
        return;
    }
    let randomAlien =
        Game.scenes[Game.currentScene].images["alien"][
            Math.floor(Math.random() * totalAliens)
        ];

    Game.scenes[Game.currentScene].addObject(
        "bomb",
        new Rect(
            {
                x: randomAlien.position.x + randomAlien.frameWidth / 2 - 5,
                y: randomAlien.position.y + randomAlien.image.height,
            },
            10,
            10,
            "red"
        )
    );

    setTimeout(() => Game.generateBomb(), Math.random() * 1000);
};

Game.drawLevel = function () {
    this.scenes[this.currentScene].draw();
    this.scenes[this.currentScene].update();

    if (this.scenes[this.currentScene]?.images["alien"]?.length == 0) {
        new Message(
            "You Won",
            {
                x: WIDTH / 2,
                y: HEIGHT / 2,
            },
            "100px game-font",
            "green"
        ).draw();
        return true;
    }
    //add condition for lose
    if(Game.life === 0){
        new Message(
            "GAME OVER",
            {
                x: WIDTH / 2,
                y: HEIGHT / 2,
            },
            "100px game-font",
            "red"
        ).draw();
        new Message(
            "Press F5 to restart",
            {
                x: WIDTH / 2,
                y: HEIGHT / 2 + 50,
            },
            "15px game-font",
            "white"
        ).draw();
        Game.audios["gameover"].play();
        return true;
    }

    return false;
};

function hasCollided(obj1, obj2) {
    let dims1 = {
        centerX: obj1.position.x + ((obj1.dim.width * obj1.scale) / 2),
        centerY: obj1.position.y + ((obj1.dim.height * obj1.scale) / 2),
        radius: obj1.dim.width / 2,
    };
    let dims2 = {
        centerX: obj2.position.x + (obj2.dim.width * obj2.scale / 2),
        centerY: obj2.position.y + (obj2.dim.height * obj2.scale / 2),
        radius: obj2.dim.width / 2,
    };

    if (
        getDistance(
            dims1.centerX,
            dims1.centerY,
            dims2.centerX,
            dims2.centerY
        ) <
        dims1.radius + dims2.radius
    ) {
        return true;
    }
    return false;
}

function getDistance(x1, y1, x2, y2) {
    return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 1 / 2);
}
