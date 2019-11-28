import {Sprite} from "../base/Sprite.js";

export class Poker extends Sprite {

    constructor(keys,top,leftX,leftY,size,boolean) {//添加一个boolean类型进行判断牌是否被点击
        const image = Sprite.getImage(keys);
        super(image,
            0, 0,
            image.width, image.height,
            8+leftX, leftY+top,
            2*image.width / size, 2*image.height / size);
        this.boolean=boolean;
    }



    draw(){
        super.draw(this.img,
            this.srcX,
            this.srcY,
            this.srcW,
            this.srcH,
            this.x,
            this.y,
            this.width,
            this.height);
    }


}