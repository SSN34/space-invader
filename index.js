//consts
const WIDTH = innerWidth;
const HEIGHT = innerHeight;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

Game.init(canvas.getContext("2d"));

Game.load();

let KeysPressed = {
    ArrowRight: false,
    ArrowLeft: false,
};

window.addEventListener("load", () => {
    Game.createLevels();

    console.log("Game Started!!!, Hope you enjoy this :)");

    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            // start game case
            case "Enter":
                if (Game.currentScene == "play") {
                    break;
                }
                Game.scenes[Game.currentScene].clear();
                Game.currentScene = "play";
                Game.scenes[Game.currentScene].init();
                window.addEventListener("keydown", addEventListnerForShip);
                window.addEventListener("keyup", addEventListnerForShipKeyUp);
                break;
            case "Escape":
                Game.scenes[Game.currentScene].clear();
                Game.currentScene = "start";
                Game.scenes[Game.currentScene].init();
                window.removeEventListener(
                    "keydown",
                    addEventListnerForShip,
                    false
                );
                window.removeEventListener(
                    "keyup",
                    addEventListnerForShipKeyUp,
                    false
                );
                break;
            default:
                break;
        }
    });
    run();
});

function run() {
    Game.drawLevel();

    requestAnimationFrame(run);
}

function addEventListnerForShip(e) {
    switch (e.key) {
        case " ":

            if (Game.currentScene == "play" &&  Game.scenes[Game.currentScene].objects["bullet"]?.length >= 5) {
                break;
            }
            Game.scenes[Game.currentScene].addObject(
                "bullet",
                new Rect(
                    {
                        x:
                            Game.scenes[Game.currentScene].images["ship"][0]
                                .position.x +
                            Game.scenes[Game.currentScene].images["ship"][0]
                                .frameWidth /
                                2 -
                            1,
                        y: Game.scenes[Game.currentScene].images["ship"][0]
                            .position.y,
                    },
                    2,
                    10,
                    "white"
                )
            );
            break;
        case "ArrowRight":
            KeysPressed.ArrowRight = true;
            break;
        case "ArrowLeft":
            KeysPressed.ArrowLeft = true;
            break;
        default:
            break;
    }
}

function addEventListnerForShipKeyUp(e) {
    switch (e.key) {
        case "ArrowRight":
            KeysPressed.ArrowRight = false;
            break;
        case "ArrowLeft":
            KeysPressed.ArrowLeft = false;
            break;
        default:
            break;
    }
}
