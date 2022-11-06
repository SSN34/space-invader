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
        if (imageName in this.images) {
            this.images[imageName].push(imageObj);
        } else {
            this.images[imageName] = [imageObj];
        }
    }
    update() {}
    init() {
        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.init();
            });
        });
    }
    clear() {
        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.clear();
            });
        });
    }
    draw() {
        Object.values(this.objects).forEach((eachObj) => {
            eachObj.forEach((element) => {
                element.draw();
            });
        });

        Object.values(this.images).forEach((eachImageGrp) => {
            eachImageGrp.forEach((image) => {
                image.draw();
            });
        });
    }
}

class CtxImage {
    constructor(
        image,
        position,
        shakeImage,
        spriteFrames = 1,
        spriteFPS = 10,
        scale = 1
    ) {
        this.image = image;
        this.position = position;
        this.scale = scale;
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
        this.coin = [-1, 1];
        this.init();
    }

    init() {
        this.intervalIDs.push(setInterval(() => this.shakeImageFrame(), 100));
        this.intervalIDs.push(
            setInterval(() => this.updateSprite(), 1000 / this.spriteFPS)
        );
    }

    clear() {
        this.intervalIDs.forEach((x) => clearInterval(x));
    }

    draw() {
        let imgattrs = {
            sx: this.frameWidth * this.currentSprite,
            sy: 0,
            sw: this.frameWidth,
            sh: this.image.height,
            dx: this.position.x + this.displace.x,
            dy: this.position.y + this.displace.y,
            dw: this.frameWidth * this.scale,
            dh: this.image.height * this.scale,
        };

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

    updateSprite() {
        if (this.spriteFrames - 1 == this.currentSprite) {
            this.currentSprite = 0;
        } else {
            this.currentSprite++;
        }
    }

    shakeImageFrame() {
        if (this.shakeImage) {
            this.displace.x *= this.coin[Math.floor(Math.random() * 2)];
            this.displace.y *= this.coin[Math.floor(Math.random() * 2)];
        }
    }
}

class Alien extends CtxImage {
    constructor(image, position, shakeImage, spriteFrames, spriteFPS, scale) {
        super(image, position, shakeImage, spriteFrames, spriteFPS, scale);
        this.speedX = 16;
    }
}

class Ship extends CtxImage {
    constructor(image, position, shakeImage, spriteFrames, spriteFPS, scale) {
        super(image, position, shakeImage, spriteFrames, spriteFPS, scale);
        this.speedX = 5;
    }

    updateMovementDirection() {
        let direction = KeysPressed.ArrowRight
            ? 1
            : KeysPressed.ArrowLeft
            ? -1
            : 0;
        let bounds = this.position.x + this.speedX * direction;
        if (bounds >= 0 && bounds + this.frameWidth <= WIDTH) {
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

class Message {
    constructor(text, position, font, color) {
        this.text = text;
        this.font = font;
        this.color = color;
        this.position = position;
    }

    draw() {
        Game.ctx.font = this.font;
        Game.ctx.textAlign = "center";
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillText(this.text, this.position.x, this.position.y);
    }
}
