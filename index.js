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
        // console.log(event.key);
        switch (event.key) {
            // start game case
            case "Enter":
                Game.currentScene = "play";
                break;
            case " ":
                // shoot bullet
                break;
            case "ArrowRight":
                // Move ship right
                break;
            case "ArrowLeft":
                // Move ship left
                break;
            default:
                break;
        }
    })
    run();
});

function run(){

    Game.drawLevel();

    requestAnimationFrame(run);
}