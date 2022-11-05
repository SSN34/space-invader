class Scene {
    constructor() {
        this.objects = {};
        this.images = {};
    }

    addObject(name, object) {
        if (name in this.objects) {
            this.objects[name].push(object);
        } else {
            this.objects[name] = [object];
        }
    }
    addImage(imageName, imageObj) {
        this.images[imageName] = imageObj;
    }
    update() {}
    init(){
        Object.values(this.images).forEach((image) => {
            image.init();
        });
    }
    clear(){
        Object.values(this.images).forEach((image) => {
            image.clear();
        });
    }
    draw() {
        Object.values(this.objects).forEach((eachObj) => {
            eachObj.forEach((element) => {
                element.draw();
            });
        });

        Object.values(this.images).forEach((image) => {
            image.draw();
        });
    }
}

class CtxImage {
    constructor(image, position, shakeImage, spriteFrames = 1, spriteFPS = 10) {
        this.speedX = 10;
        this.image = image;
        this.position = position;
        this.shakeImage = shakeImage;
        this.spriteFrames = spriteFrames;
        this.frameWidth = image.width / spriteFrames;
        this.currentSprite = 0;
        this.intervalIDs = [];
        this.spriteFPS = spriteFPS;
        this.displace = {
            x: 1,
            y: 1,
        };
        this.coin = [-1,1];
        this.init();
    }
    
    init(){
        this.intervalIDs.push(setInterval(() => this.shakeImageFrame(), 100));
        this.intervalIDs.push(setInterval(() => this.updateSprite(), 1000 / this.spriteFPS));
    }

    clear(){
        this.intervalIDs.forEach(x => clearInterval(x));
    }

    draw() {
        let imgattrs = {
            sx: this.frameWidth * this.currentSprite,
            sy: 0,
            sw: this.frameWidth,
            sh: this.image.height,
            dx: this.position.x + this.displace.x,
            dy: this.position.y + this.displace.y,
            dw: this.frameWidth,
            dh: this.image.height
        }

        Game.ctx.drawImage(
            this.image,
            imgattrs.sx,
            imgattrs.sy,
            imgattrs.sw,
            imgattrs.sh,
            imgattrs.dx,
            imgattrs.dy,
            imgattrs.dw,
            imgattrs.dh
        );
    }

    updateSprite(){
        if(this.spriteFrames - 1 == this.currentSprite){
            this.currentSprite = 0;
        }else{
            this.currentSprite++;
        }
    }

    shakeImageFrame() {
        if (this.shakeImage) {
            this.displace.x *= this.coin[Math.floor( Math.random() * 2)];
            this.displace.y *= this.coin[Math.floor( Math.random() * 2)];
        }
    }
}

class Ship extends CtxImage{
    constructor(image, position, shakeImage, spriteFrames, spriteFPS) {
        super(image, position, shakeImage, spriteFrames, spriteFPS);
    }

    updateMovementDirection(direction){
        let bounds = this.position.x + this.speedX * direction;
        if(bounds >= 0 && bounds + this.frameWidth <= WIDTH){
            this.position.x += this.speedX * direction;
        }
    }
}

class Rect {
    constructor(position, l, b, color) {
        this.position = position;
        this.color = color;
        this.dim = {
            l: l,
            b: b,
        };
    }

    draw() {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.dim.l,
            this.dim.b
        );
    }
}
