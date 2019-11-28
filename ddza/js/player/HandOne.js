import {Sprite} from "../base/Sprite.js";

export class HandOne extends Sprite{
    constructor(){
    const image = Sprite.getImage('hand1');
    super(image, 0, 0, image.width, image.height,
    0, 0, image.width, image.height);



}

drawUp() {
    this.ctx.save();
    this.ctx.translate(282,370);
    this.ctx.rotate(80*Math.PI/180);
    super.draw(
        this.img,
        0, 0,
        40,  45,
        0,  0,
        40,45
    );
    this.ctx.restore();
}

drawDown(){
    this.ctx.save();
    this.ctx.translate(292,375);
    this.ctx.rotate(90*Math.PI/180);
    super.draw(
        this.img,
        0, 45,
        40,  50,
        0,  0,
        40,50
    );
    this.ctx.restore();
}

}