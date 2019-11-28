import {Sprite} from "../base/Sprite.js";

export class HandTwo extends Sprite{
    constructor(){
        const image = Sprite.getImage('hand2');
        super(image, 0, 0, image.width, image.height,
            0, 0, image.width, image.height);



    }

    drawUp() {
        this.ctx.save();
        this.ctx.translate(292,340);
        this.ctx.rotate(80*Math.PI/180);
        super.draw(
            this.img,
            10, 25,
            60,  50,
            0,  0,
            60,50
        );
        this.ctx.restore();
    }

    drawDown(){
        this.ctx.save();
        this.ctx.translate(291,345);
        this.ctx.rotate(130*Math.PI/180);
        super.draw(
            this.img,
            0, 0,
            60,  28,
            0,  0,
            60,28
        );
        this.ctx.restore();
    }

}