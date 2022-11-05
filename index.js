//consts
const WIDTH = innerWidth;
const HEIGHT = innerHeight;

let canvas = document.getElementsByTagName("canvas")[0];
canvas.height = HEIGHT;
canvas.width = WIDTH;

Game.init(canvas.getContext("2d"));

Game.load();

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
            Game.scenes[Game.currentScene].addObject("bullet", new Rect({
                x: Game.scenes[Game.currentScene].images["ship"].position.x + Game.scenes[Game.currentScene].images["ship"].frameWidth / 2 - 1,
                y: Game.scenes[Game.currentScene].images["ship"].position.y,
            }, 2, 10, "white"));
            break;
        case "ArrowRight":
            Game.scenes[Game.currentScene].images[
                "ship"
            ].updateMovementDirection(1);
            break;
        case "ArrowLeft":
            Game.scenes[Game.currentScene].images[
                "ship"
            ].updateMovementDirection(-1);
            break;
        default:
            break;
    }
}
