import {Sprite} from "../base/Sprite.js";

export class gameLose extends Sprite{
    constructor(){
        const image = Sprite.getImage('lose');
        super(image, 0,0,image.width,image.height,
            0 , 0  , image.width,image.height);
    }
    drawLose(){
        this.ctx.save();
        this.ctx.translate(320,200);
        this.ctx.rotate(90*Math.PI/180);
        super.draw(this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            0,
            0,
            this.img.width,
            this.img.height);
        this.ctx.restore();

    }
}