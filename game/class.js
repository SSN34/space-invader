class Scene {
    constructor() {
        this.objects = {};
        this.images = [];
    }

    addObject(name, object) {
        if (name in this.objects) {
            this.objects[name].push(object);
        } else {
            this.objects[name] = [object];
        }
    }
    addImage(imageObj) {
        this.images.push(imageObj);
    }
    update() {}
    draw() {
        Object.values(this.objects).forEach((eachObj) => {
            eachObj.forEach((element) => {
                element.draw();
            });
        });

        this.images.forEach((image) => {
            image.draw();
        });
    }
}

class CtxImage {
    constructor(image, position, shakeImage) {
        this.image = image;
        this.position = position;
        this.shakeImage = shakeImage;
        this.displace = {
            x: 1,
            y: 1,
        };
        this.coin = [-1,1]
        setInterval(() => this.shakeImageFrame(), 100);
    }

    draw() {
        Game.ctx.drawImage(
            this.image,
            this.position.x + this.displace.x,
            this.position.y + this.displace.y
        );
    }

    shakeImageFrame() {
        if (this.shakeImage) {
            this.displace.x *= this.coin[Math.floor( Math.random() * 2)];
            this.displace.y *= this.coin[Math.floor( Math.random() * 2)];
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
